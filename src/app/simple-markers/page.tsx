'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

export default function SimpleMarkersPage() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: [33.5731, -7.5898],
      zoom: 10,
    });

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add some default markers
    const marker1 = L.marker([33.5731, -7.5898]).addTo(map);
    marker1.bindPopup('Default Marker 1');

    const marker2 = L.marker([33.6, -7.6]).addTo(map);
    marker2.bindPopup('Default Marker 2');

    // Add a div icon marker (like our custom ones)
    const divIcon = L.divIcon({
      className: 'test-marker',
      html: '<div style="width: 40px; height: 40px; background: red; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">🚗</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker3 = L.marker([33.5, -7.5], { icon: divIcon, zIndexOffset: 1000 }).addTo(map);
    marker3.bindPopup('Custom Div Icon Marker');

    console.log('Simple markers test - added 3 markers');
    console.log('Marker 1:', marker1.getLatLng());
    console.log('Marker 2:', marker2.getLatLng());
    console.log('Marker 3:', marker3.getLatLng());

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-xl font-bold">Simple Markers Test</h1>
        <p className="text-sm text-gray-600">Testing if basic markers appear on the map</p>
      </div>
      <div className="flex-1" ref={mapContainerRef} />
    </div>
  );
}
