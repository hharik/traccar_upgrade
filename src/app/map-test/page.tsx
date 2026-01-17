'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTest() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    console.log('Initializing test map...');
    
    // Create map
    const map = L.map(mapContainerRef.current).setView([33.5731, -7.5898], 6);

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    // Add a simple test marker
    const testMarker = L.marker([33.5731, -7.5898]).addTo(map);
    testMarker.bindPopup('Test Marker - Casablanca').openPopup();

    // Add custom div icon marker
    const customIcon = L.divIcon({
      className: 'custom-test-marker',
      html: '<div style="background: red; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 20px;">🚗</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    L.marker([34, -6], { icon: customIcon }).addTo(map)
      .bindPopup('Custom Icon Test');

    mapRef.current = map;
    console.log('Test map initialized');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Map Test Page</h1>
        <p className="text-sm">Testing Leaflet map rendering</p>
      </div>
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="absolute inset-0" style={{ zIndex: 1 }} />
      </div>
    </div>
  );
}
