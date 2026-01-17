'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TraccarDevice, TraccarPosition } from '@/types/traccar';
import dynamic from 'next/dynamic';

// Dynamically import HistoryPlayer to avoid SSR issues
const HistoryPlayer = dynamic(() => import('./HistoryPlayer'), { ssr: false });

// Fix for default marker icon - using CDN URLs
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface MapViewProps {
  devices: TraccarDevice[];
  positions: TraccarPosition[];
}

export default function MapView({ devices, positions }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});
  const [selectedDevice, setSelectedDevice] = useState<TraccarDevice | null>(null);
  const initialBoundsFitRef = useRef(false); // Track if we've done initial bounds fit
  const [showHistory, setShowHistory] = useState(false);
  const [historyDevice, setHistoryDevice] = useState<TraccarDevice | null>(null);
  const [historyPositions, setHistoryPositions] = useState<TraccarPosition[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Make history menu function available globally for popup buttons
    if (typeof window !== 'undefined') {
      (window as any).showHistoryMenu = (deviceId: number) => {
        const device = devices.find(d => d.id === deviceId);
        if (device) {
          setSelectedDevice(device);
          setShowHistoryMenu(true);
        }
      };
    }

    try {
      // Create map centered on Morocco (based on your timezone)
      const map = L.map(mapContainerRef.current, {
        center: [33.5731, -7.5898],
        zoom: 6,
        zoomControl: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      console.log('✓ Map initialized successfully');
      
      // Give the map time to fully initialize before adding markers
      setTimeout(() => {
        map.invalidateSize();
        console.log('✓ Map size invalidated and ready for markers');
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when positions change
  useEffect(() => {
    if (!mapRef.current || devices.length === 0) {
      console.log('Map not ready or no devices yet');
      return;
    }

    // Wait a bit for map to be fully ready before adding markers
    const timer = setTimeout(() => {
      if (!mapRef.current) return;
      
      const map = mapRef.current;
      const bounds: L.LatLngBounds = L.latLngBounds([]);
      let hasValidPositions = false;
      let markersUpdated = 0;
      let markersCreated = 0;

      console.log('=== MAP UPDATE ===');
      console.log('Total devices:', devices.length);
      console.log('Total positions:', positions.length);
      console.log('Existing markers:', Object.keys(markersRef.current).length);

      devices.forEach((device) => {
        // Try to find position by matching positionId first, then by deviceId
        let position = positions.find((p) => p.id === device.positionId);
        if (!position) {
          position = positions.find((p) => p.deviceId === device.id);
        }
        
        if (position && position.latitude && position.longitude) {
          hasValidPositions = true;
          const latLng: L.LatLngExpression = [position.latitude, position.longitude];
          bounds.extend(latLng);
          
          // Check if marker already exists
          const existingMarker = markersRef.current[device.id];
          
          if (existingMarker) {
            // Just update the position and icon - DON'T recreate the marker
            existingMarker.setLatLng(latLng);
            
            // Update icon to reflect current status and speed
            const iconColor = device.status === 'online' ? '#22c55e' : '#ef4444';
            const iconHtml = `
              <div style="position: relative; width: 120px; height: 60px; margin-left: -40px; margin-top: -20px;">
                <!-- Vehicle Name Label -->
                <div style="
                  position: absolute;
                  top: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  background: rgba(255, 255, 255, 0.95);
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  padding: 2px 6px;
                  font-size: 10px;
                  font-weight: 600;
                  color: #333;
                  white-space: nowrap;
                  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                  max-width: 110px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">${device.name}</div>
                
                <!-- Car Icon -->
                <div style="
                  position: absolute;
                  top: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 36px;
                  height: 36px;
                  background: ${iconColor};
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                ">🚗</div>
                
                <!-- Speed Badge -->
                ${position.speed > 0 ? `
                  <div style="
                    position: absolute;
                    top: 12px;
                    right: 30px;
                    background: white;
                    border: 2px solid ${iconColor};
                    border-radius: 12px;
                    padding: 2px 6px;
                    font-size: 10px;
                    font-weight: bold;
                    color: #333;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    white-space: nowrap;
                  ">${Math.round(position.speed * 1.852)}km/h</div>
                ` : ''}
              </div>
            `;
            
            const updatedIcon = L.divIcon({
              className: 'custom-vehicle-marker',
              html: iconHtml,
              iconSize: [120, 60],
              iconAnchor: [60, 40],
              popupAnchor: [0, -40],
            });
            
            existingMarker.setIcon(updatedIcon);
            markersUpdated++;
          } else {
            // Create new marker ONLY if it doesn't exist
            try {
              // Create custom car icon
              const iconColor = device.status === 'online' ? '#22c55e' : '#ef4444';
              const iconHtml = `
                <div style="position: relative; width: 120px; height: 60px; margin-left: -40px; margin-top: -20px;">
                  <!-- Vehicle Name Label -->
                  <div style="
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-size: 10px;
                    font-weight: 600;
                    color: #333;
                    white-space: nowrap;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                    max-width: 110px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">${device.name}</div>
                  
                  <!-- Car Icon -->
                  <div style="
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 36px;
                    height: 36px;
                    background: ${iconColor};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                  ">🚗</div>
                  
                  <!-- Speed Badge -->
                  ${position.speed > 0 ? `
                    <div style="
                      position: absolute;
                      top: 12px;
                      right: 30px;
                      background: white;
                      border: 2px solid ${iconColor};
                      border-radius: 12px;
                      padding: 2px 6px;
                      font-size: 10px;
                      font-weight: bold;
                      color: #333;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                      white-space: nowrap;
                    ">${Math.round(position.speed * 1.852)}km/h</div>
                  ` : ''}
                </div>
              `;
              
              const customIcon = L.divIcon({
                className: 'custom-vehicle-marker',
                html: iconHtml,
                iconSize: [120, 60],
                iconAnchor: [60, 40],
                popupAnchor: [0, -40],
              });
              
              const marker = L.marker(latLng, { 
                icon: customIcon,
                zIndexOffset: 1000
              }).addTo(map);
              
              console.log(`  ✓ Creating marker for ${device.name} at [${position.latitude}, ${position.longitude}]`);
              
              // Add popup with history button
              const popupContent = `
                <div style="min-width: 220px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${device.name}</h3>
                  <div style="font-size: 12px; line-height: 1.6; margin-bottom: 12px;">
                    <div><strong>Status:</strong> <span style="color: ${iconColor};">${device.status}</span></div>
                    <div><strong>Speed:</strong> ${Math.round(position.speed * 1.852)} km/h</div>
                    <div><strong>Last Update:</strong> ${new Date(position.fixTime).toLocaleString()}</div>
                    ${position.address ? `<div><strong>Location:</strong> ${position.address}</div>` : ''}
                    <div style="margin-top: 8px;">
                      <strong>Coordinates:</strong><br/>
                      ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}
                    </div>
                  </div>
                  <button 
                    onclick="window.showHistoryMenu(${device.id})"
                    style="
                      width: 100%;
                      background: #4f46e5;
                      color: white;
                      border: none;
                      padding: 8px 12px;
                      border-radius: 6px;
                      cursor: pointer;
                      font-size: 13px;
                      font-weight: 600;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      gap: 6px;
                    "
                    onmouseover="this.style.background='#4338ca'"
                    onmouseout="this.style.background='#4f46e5'"
                  >
                    <span>📍</span>
                    <span>View History</span>
                  </button>
                </div>
              `;
              
              marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
              });
              marker.on('click', () => {
                setSelectedDevice(device);
                // Zoom to the clicked marker
                map.setView(latLng, 16, {
                  animate: true,
                  duration: 0.5
                });
              });
              
              // Store the marker
              markersRef.current[device.id] = marker;
              markersCreated++;
            } catch (error) {
              console.error(`Error creating marker for ${device.name}:`, error);
            }
          }
        }
      });

      console.log(`✓ Markers - Created: ${markersCreated}, Updated: ${markersUpdated}, Total: ${Object.keys(markersRef.current).length}`);

      // Fit bounds ONLY on first load, not on updates
      if (hasValidPositions && bounds.isValid() && !initialBoundsFitRef.current) {
        console.log('✓ Fitting map to bounds (first load)');
        
        // Use setTimeout to ensure map is ready
        setTimeout(() => {
          try {
            map.invalidateSize();
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            initialBoundsFitRef.current = true;
            console.log('✓ Bounds fitted successfully');
          } catch (error) {
            console.error('Error fitting bounds:', error);
          }
        }, 300);
      }
      
      console.log('=== MAP UPDATE COMPLETE ===\n');
    }, 500); // Wait 500ms for map to be ready

    return () => clearTimeout(timer);
  }, [devices, positions]);

  const getDevicePosition = (deviceId: number) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return null;
    
    // Try to find position by matching positionId first, then by deviceId
    let position = positions.find(p => p.id === device.positionId);
    if (!position) {
      position = positions.find(p => p.deviceId === deviceId);
    }
    return position || null;
  };

  const zoomToDevice = (device: TraccarDevice) => {
    const position = getDevicePosition(device.id);
    if (position && mapRef.current) {
      mapRef.current.setView([position.latitude, position.longitude], 16);
      markersRef.current[device.id]?.openPopup();
      setSelectedDevice(device);
    }
  };

  const loadHistory = async (device: TraccarDevice, hours: number = 24) => {
    setLoadingHistory(true);
    setShowHistoryMenu(false);
    try {
      const to = new Date();
      const from = new Date(to.getTime() - hours * 60 * 60 * 1000);
      
      console.log('[History] Loading for device:', device.id, 'Hours:', hours);
      console.log('[History] From:', from.toISOString(), 'To:', to.toISOString());
      
      const response = await fetch(
        `/api/history?deviceId=${device.id}&from=${from.toISOString()}&to=${to.toISOString()}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load history');
      }
      
      const data = await response.json();
      console.log('[History] Retrieved', data.length, 'positions');
      
      if (data.length === 0) {
        alert('No history data available for this period');
        setLoadingHistory(false);
        return;
      }
      
      setHistoryPositions(data);
      setHistoryDevice(device);
      setShowHistory(true);
    } catch (error: any) {
      console.error('[History] Error loading history:', error);
      alert('Failed to load history: ' + error.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadHistoryCustom = async (device: TraccarDevice, fromDate: Date, toDate: Date) => {
    setLoadingHistory(true);
    setShowHistoryMenu(false);
    setShowCustomDatePicker(false);
    try {
      const response = await fetch(
        `/api/history?deviceId=${device.id}&from=${fromDate.toISOString()}&to=${toDate.toISOString()}`
      );
      
      if (!response.ok) throw new Error('Failed to load history');
      
      const data = await response.json();
      
      if (data.length === 0) {
        alert('No history data available for this period');
        setLoadingHistory(false);
        return;
      }
      
      setHistoryPositions(data);
      setHistoryDevice(device);
      setShowHistory(true);
    } catch (error) {
      console.error('Error loading history:', error);
      alert('Failed to load history. Please try again.');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="flex h-full relative">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapContainerRef} 
          className="absolute inset-0" 
          style={{ zIndex: 1 }}
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
          <div className="text-sm space-y-2">
            <div className="font-semibold text-gray-900">Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Online ({devices.filter(d => d.status === 'online').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Offline ({devices.filter(d => d.status === 'offline').length})</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Total: {devices.length} vehicles
            </div>
            <div className="text-xs font-bold text-blue-600 mt-2 pt-2 border-t">
              Markers: {Object.keys(markersRef.current).length}
            </div>
          </div>
        </div>
        
        {/* Debug info */}
        {devices.length === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-[1000]">
            <p className="text-gray-600">Loading vehicles...</p>
          </div>
        )}
      </div>

      {/* Compact Hovering Vehicle List */}
      <div 
        className="absolute left-4 top-20 z-[1000] w-72 max-h-[calc(100vh-180px)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-white">Vehicles</h2>
              <p className="text-xs text-indigo-100">{devices.length} total • {devices.filter(d => d.status === 'online').length} online</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white font-medium">Live</span>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full px-3 py-2 pl-9 text-sm bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Scrollable Vehicle List */}
        <div className="overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="p-2 space-y-1.5">
            {/* Filter devices based on search query */}
            {devices.filter(device => 
              device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              device.uniqueId?.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-sm text-gray-600">No vehicles found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            ) : (
              devices.filter(device => 
                device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.uniqueId?.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((device) => {
              const position = getDevicePosition(device.id);
              const isOnline = device.status === 'online';
              const isSelected = selectedDevice?.id === device.id;
              
              return (
                <div
                  key={device.id}
                  onClick={() => zoomToDevice(device)}
                  className={`
                    relative p-2.5 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md scale-[1.02]' 
                      : 'bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md hover:scale-[1.01]'
                    }
                  `}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2">
                    <div className={`
                      w-2 h-2 rounded-full
                      ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}
                    `} />
                  </div>

                  <div className="pr-4">
                    {/* Vehicle Name */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-lg">🚗</span>
                      <div className="font-semibold text-gray-900 text-sm truncate">
                        {device.name}
                      </div>
                    </div>
                    
                    {position ? (
                      <div className="space-y-1">
                        {/* Speed */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded text-xs">
                            ⚡
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {Math.round(position.speed * 1.852)} km/h
                          </span>
                        </div>
                        
                        {/* Location (if available) */}
                        {position.address && (
                          <div className="flex items-start gap-1.5">
                            <div className="w-5 h-5 flex items-center justify-center bg-green-100 rounded text-xs mt-0.5">
                              📍
                            </div>
                            <span className="text-xs text-gray-600 line-clamp-2 flex-1">
                              {position.address}
                            </span>
                          </div>
                        )}
                        
                        {/* Last Update */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded text-xs">
                            🕐
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(position.fixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">No position data</div>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>

      {/* History Player Modal */}
      {showHistory && historyDevice && historyPositions.length > 0 && (
        <HistoryPlayer
          device={historyDevice}
          positions={historyPositions}
          onClose={() => {
            setShowHistory(false);
            setHistoryDevice(null);
            setHistoryPositions([]);
          }}
        />
      )}

      {/* History Menu Modal */}
      {showHistoryMenu && selectedDevice && (
        <>
          <div className="fixed inset-0 z-[10000]" onClick={() => setShowHistoryMenu(false)}></div>
          <div 
            className="fixed top-6 left-6 z-[10001] bg-white rounded-xl shadow-2xl w-64 overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold truncate">{selectedDevice.name}</span>
                <button
                  onClick={() => setShowHistoryMenu(false)}
                  className="hover:bg-white hover:bg-opacity-20 rounded p-1 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => loadHistory(selectedDevice, 24)}
                disabled={loadingHistory}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 transition-colors flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Last 24 Hours</div>
                  <div className="text-xs text-gray-500">Today's route</div>
                </div>
              </button>

              <button
                onClick={() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                  loadHistoryCustom(selectedDevice, yesterday, today);
                }}
                disabled={loadingHistory}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-purple-50 disabled:bg-gray-100 transition-colors flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Yesterday</div>
                  <div className="text-xs text-gray-500">Previous day</div>
                </div>
              </button>

              <button
                onClick={() => loadHistory(selectedDevice, 168)}
                disabled={loadingHistory}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-indigo-50 disabled:bg-gray-100 transition-colors flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Last 7 Days</div>
                  <div className="text-xs text-gray-500">Weekly route</div>
                </div>
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={() => setShowCustomDatePicker(true)}
                disabled={loadingHistory}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-green-50 disabled:bg-gray-100 transition-colors flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Custom Range</div>
                  <div className="text-xs text-gray-500">Pick dates</div>
                </div>
              </button>

              {loadingHistory && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-blue-700 font-medium">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Custom Date Picker Modal */}
      {showCustomDatePicker && selectedDevice && (
        <div className="fixed inset-0 z-[10001] bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-w-[95vw] overflow-hidden transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">Custom Date Range</h3>
                <button
                  onClick={() => setShowCustomDatePicker(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="font-medium">{selectedDevice.name}</p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const fromDate = new Date(formData.get('fromDate') as string);
                const toDate = new Date(formData.get('toDate') as string);
                
                if (toDate <= fromDate) {
                  alert('End date must be after start date');
                  return;
                }
                
                const diffMs = toDate.getTime() - fromDate.getTime();
                const diffDays = diffMs / (1000 * 60 * 60 * 24);
                
                if (diffDays > 30) {
                  alert('Maximum date range is 30 days');
                  return;
                }
                
                loadHistoryCustom(selectedDevice, fromDate, toDate);
              }}
              className="p-6 space-y-6"
            >
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Select your date range</p>
                    <p className="text-blue-600">Maximum range: 30 days</p>
                  </div>
                </div>
              </div>

              {/* From Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="fromDate"
                  required
                  defaultValue={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-700 font-medium"
                />
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="toDate"
                  required
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-700 font-medium"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loadingHistory}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loadingHistory ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Load History</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomDatePicker(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
