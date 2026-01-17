'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TraccarDevice, TraccarPosition } from '@/types/traccar';

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

export default function MapDefaultMarkersPage() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [devices, setDevices] = useState<TraccarDevice[]>([]);
  const [positions, setPositions] = useState<TraccarPosition[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesRes, positionsRes] = await Promise.all([
          fetch('/api/devices'),
          fetch('/api/positions'),
        ]);

        const devicesData = await devicesRes.json();
        const positionsData = await positionsRes.json();

        setDevices(devicesData);
        setPositions(positionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [33.5731, -7.5898],
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    console.log('Map initialized');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Add markers when data is ready
  useEffect(() => {
    if (!mapRef.current || loading || devices.length === 0) return;

    const map = mapRef.current;
    console.log('Adding default markers for', devices.length, 'devices');

    let markerCount = 0;
    const bounds = L.latLngBounds([]);

    devices.forEach((device) => {
      const position = positions.find((p) => p.id === device.positionId) || 
                      positions.find((p) => p.deviceId === device.id);
      
      if (position && position.latitude && position.longitude) {
        const latLng: [number, number] = [position.latitude, position.longitude];
        
        // Use DEFAULT marker - no custom icon
        const marker = L.marker(latLng).addTo(map);
        marker.bindPopup(`<strong>${device.name}</strong><br>ID: ${device.id}`);
        
        bounds.extend(latLng);
        markerCount++;
        
        console.log(`Added default marker ${markerCount} for ${device.name} at`, latLng);
      }
    });

    console.log(`Total default markers added: ${markerCount}`);

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [devices, positions, loading]);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-xl font-bold">Map with Default Markers</h1>
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `Showing ${devices.length} vehicles with default blue markers`}
        </p>
      </div>
      <div className="flex-1" ref={mapContainerRef} />
    </div>
  );
}
