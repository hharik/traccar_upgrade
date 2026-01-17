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

export default function TestOneMarkerPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    console.log('Initializing map...');
    
    // Create map
    const map = L.map(mapContainerRef.current, {
      center: [31.638441833333335, -8.0149715],
      zoom: 10,
    });

    console.log('Map created, adding tiles...');

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    console.log('Tiles added, creating marker...');

    // Add ONE marker at the position from your actual data
    const marker = L.marker([31.638441833333335, -8.0149715]).addTo(map);
    marker.bindPopup('Test Marker');

    console.log('Marker added!', marker);
    console.log('Map bounds:', map.getBounds());
    console.log('Map center:', map.getCenter());
    console.log('Map zoom:', map.getZoom());

    // Force map to redraw
    setTimeout(() => {
      map.invalidateSize();
      console.log('Map invalidated');
    }, 100);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Test One Marker</h1>
        <p className="text-sm">Single marker at 31.638, -8.014 (from real data)</p>
      </div>
      <div className="flex-1" ref={mapContainerRef} style={{ background: '#aad3df' }} />
    </div>
  );
}
