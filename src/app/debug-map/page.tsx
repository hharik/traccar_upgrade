'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import type { TraccarDevice, TraccarPosition } from '@/types/traccar';

export default function DebugMapPage() {
  const [devices, setDevices] = useState<TraccarDevice[]>([]);
  const [positions, setPositions] = useState<TraccarPosition[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    fetchDebugData();
  }, []);

  const fetchDebugData = async () => {
    try {
      const [devicesRes, positionsRes, debugRes] = await Promise.all([
        fetch('/api/devices'),
        fetch('/api/positions'),
        fetch('/api/debug'),
      ]);

      const devicesData = await devicesRes.json();
      const positionsData = await positionsRes.json();
      const debugData = await debugRes.json();

      setDevices(devicesData);
      setPositions(positionsData);
      setDebugInfo(debugData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const testPositionMatch = () => {
    if (devices.length === 0 || positions.length === 0) return null;

    const device = devices[0];
    const positionById = positions.find(p => p.id === device.positionId);
    const positionByDeviceId = positions.find(p => p.deviceId === device.id);

    return {
      device: {
        id: device.id,
        name: device.name,
        positionId: device.positionId,
      },
      positionById: positionById ? {
        id: positionById.id,
        deviceId: positionById.deviceId,
        lat: positionById.latitude,
        lon: positionById.longitude,
      } : null,
      positionByDeviceId: positionByDeviceId ? {
        id: positionByDeviceId.id,
        deviceId: positionByDeviceId.deviceId,
        lat: positionByDeviceId.latitude,
        lon: positionByDeviceId.longitude,
      } : null,
    };
  };

  const matchTest = testPositionMatch();

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Map Debug Information</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* API Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">API Data</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Devices:</span>
                <span className="text-green-600">{devices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Positions:</span>
                <span className="text-green-600">{positions.length}</span>
              </div>
            </div>
          </div>

          {/* Debug Info from API */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Debug API Response</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Device Count:</span>
                <span>{debugInfo.deviceCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Position Count:</span>
                <span>{debugInfo.positionCount}</span>
              </div>
            </div>
          </div>

          {/* Position Matching Test */}
          {matchTest && (
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Position Matching Test</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-600">Device Info:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(matchTest.device, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-600">
                    Position by positionId (device.positionId === position.id):
                  </h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(matchTest.positionById, null, 2)}
                  </pre>
                  {matchTest.positionById && (
                    <p className="text-green-600 mt-2">✓ Match found! This is the correct method.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-yellow-600">
                    Position by deviceId (position.deviceId === device.id):
                  </h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(matchTest.positionByDeviceId, null, 2)}
                  </pre>
                  {matchTest.positionByDeviceId && (
                    <p className="text-yellow-600 mt-2">⚠ Alternative match (may be outdated)</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sample Device */}
          {devices.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Sample Device</h2>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(devices[0], null, 2)}
              </pre>
            </div>
          )}

          {/* Sample Position */}
          {positions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Sample Position</h2>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(positions[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Check if devices and positions are being fetched</li>
            <li>Verify the position matching logic is working</li>
            <li>Confirm latitude and longitude values are valid</li>
            <li>Open browser console (F12) for more detailed logs</li>
          </ol>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
