'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TraccarDevice, TraccarPosition } from '@/types/traccar';

interface HistoryPlayerProps {
  device: TraccarDevice;
  positions: TraccarPosition[];
  onClose: () => void;
}

export default function HistoryPlayer({ device, positions, onClose }: HistoryPlayerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 1x, 2x, 5x, 10x

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || positions.length === 0) return;

    const map = L.map(mapContainerRef.current, {
      center: [positions[0].latitude, positions[0].longitude],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Draw the complete route
    const routeCoords: [number, number][] = positions.map(p => [p.latitude, p.longitude]);
    const routeLine = L.polyline(routeCoords, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.7,
    }).addTo(map);

    routeLineRef.current = routeLine;

    // Fit map to route
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    // Add start marker
    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 30px; height: 30px; background: #22c55e; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px;">🏁</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    L.marker([positions[0].latitude, positions[0].longitude], { icon: startIcon }).addTo(map)
      .bindPopup(`<strong>Start</strong><br>${new Date(positions[0].fixTime).toLocaleString()}`);

    // Add end marker
    const endIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 30px; height: 30px; background: #ef4444; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px;">🏁</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    const lastPos = positions[positions.length - 1];
    L.marker([lastPos.latitude, lastPos.longitude], { icon: endIcon }).addTo(map)
      .bindPopup(`<strong>End</strong><br>${new Date(lastPos.fixTime).toLocaleString()}`);

    // Add current position marker
    const currentIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 40px; height: 40px; background: #3b82f6; border: 4px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.4); font-size: 20px;">🚗</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    const marker = L.marker([positions[0].latitude, positions[0].longitude], { icon: currentIcon }).addTo(map);
    markerRef.current = marker;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [positions]);

  // Update marker position
  useEffect(() => {
    if (markerRef.current && positions[currentIndex]) {
      const pos = positions[currentIndex];
      markerRef.current.setLatLng([pos.latitude, pos.longitude]);
      
      // Update popup
      const popup = `
        <div style="min-width: 180px;">
          <strong>${device.name}</strong><br>
          <strong>Time:</strong> ${new Date(pos.fixTime).toLocaleTimeString()}<br>
          <strong>Speed:</strong> ${Math.round(pos.speed * 1.852)} km/h<br>
          ${pos.address ? `<strong>Location:</strong> ${pos.address}<br>` : ''}
        </div>
      `;
      markerRef.current.bindPopup(popup);
      
      // Pan map to follow marker
      if (mapRef.current) {
        mapRef.current.panTo([pos.latitude, pos.longitude]);
      }
    }
  }, [currentIndex, positions, device.name]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= positions.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, positions.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const currentPosition = positions[currentIndex];
  const duration = positions.length > 0 
    ? (new Date(positions[positions.length - 1].fixTime).getTime() - new Date(positions[0].fixTime).getTime()) / 1000 / 60
    : 0;

  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{device.name} - Route History</h2>
            <p className="text-sm opacity-90">
              {positions.length} points • {duration.toFixed(0)} minutes
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="absolute inset-0" />
        </div>

        {/* Controls */}
        <div className="bg-gray-50 border-t p-4 space-y-3">
          {/* Timeline */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={positions.length - 1}
              value={currentIndex}
              onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{currentPosition ? new Date(positions[0].fixTime).toLocaleTimeString() : '--'}</span>
              <span>
                {currentPosition ? new Date(currentPosition.fixTime).toLocaleTimeString() : '--'}
              </span>
              <span>{positions.length > 0 ? new Date(positions[positions.length - 1].fixTime).toLocaleTimeString() : '--'}</span>
            </div>
          </div>

          {/* Info & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-white px-3 py-2 rounded-lg border">
                <span className="text-gray-600">Speed:</span>
                <span className="font-bold ml-2">{currentPosition ? Math.round(currentPosition.speed * 1.852) : 0} km/h</span>
              </div>
              <div className="bg-white px-3 py-2 rounded-lg border">
                <span className="text-gray-600">Point:</span>
                <span className="font-bold ml-2">{currentIndex + 1} / {positions.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Speed selector */}
              <select
                value={playSpeed}
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
                <option value={10}>10x</option>
              </select>

              {/* Playback controls */}
              <button
                onClick={handleStop}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                ⏹ Stop
              </button>
              {isPlaying ? (
                <button
                  onClick={handlePause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ⏸ Pause
                </button>
              ) : (
                <button
                  onClick={handlePlay}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ▶ Play
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
