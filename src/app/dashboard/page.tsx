'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import type { TraccarDevice, TraccarPosition } from '@/types/traccar';

export default function DashboardPage() {
  const [devices, setDevices] = useState<TraccarDevice[]>([]);
  const [positions, setPositions] = useState<TraccarPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [devicesRes, positionsRes] = await Promise.all([
        fetch('/api/devices'),
        fetch('/api/positions'),
      ]);

      if (!devicesRes.ok || !positionsRes.ok) {
        const devicesError = !devicesRes.ok ? await devicesRes.json() : null;
        const positionsError = !positionsRes.ok ? await positionsRes.json() : null;
        throw new Error(devicesError?.error || positionsError?.error || 'Failed to fetch data');
      }

      const devicesData = await devicesRes.json();
      const positionsData = await positionsRes.json();

      setDevices(devicesData);
      setPositions(positionsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDevicePosition = (deviceId: number) => {
    return positions.find(p => p.deviceId === deviceId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading && devices.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your fleet data...</p>
          </div>
        </div>
        <Navigation />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-20">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Make sure your Traccar server is running and accessible.
                Update the credentials in the code or use the login form.
              </p>
            </div>
          </div>
        </div>
        <Navigation />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fleet Dashboard</h1>
              <p className="text-gray-600">Real-time vehicle tracking</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Vehicles</div>
                <div className="text-2xl font-bold text-indigo-600">{devices.length}</div>
              </div>
              <button
                onClick={fetchData}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">🚗</div>
            <div className="text-2xl font-bold text-gray-900">{devices.length}</div>
            <div className="text-sm text-gray-600">Total Vehicles</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">
              {devices.filter(d => d.status === 'online').length}
            </div>
            <div className="text-sm text-gray-600">Online</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">❌</div>
            <div className="text-2xl font-bold text-red-600">
              {devices.filter(d => d.status === 'offline').length}
            </div>
            <div className="text-sm text-gray-600">Offline</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">📍</div>
            <div className="text-2xl font-bold text-blue-600">{positions.length}</div>
            <div className="text-sm text-gray-600">Active Positions</div>
          </div>
        </div>

        {/* Vehicles List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Vehicle Fleet</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Device ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Update
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Speed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {devices.map((device) => {
                  const position = getDevicePosition(device.id);
                  return (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{device.name}</div>
                        {device.model && (
                          <div className="text-sm text-gray-500">{device.model}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {device.uniqueId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(device.lastUpdate).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {position ? (
                          <div>
                            <div>{position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}</div>
                            {position.address && (
                              <div className="text-xs text-gray-500 mt-1">{position.address}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No position data</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {position ? `${Math.round(position.speed * 1.852)} km/h` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
}
