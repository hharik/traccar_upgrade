'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import axios from 'axios';
import type { TraccarDevice } from '@/types/traccar';

export default function VehiclesPage() {
  const { user, logout } = useAuth();
  const [devices, setDevices] = useState<TraccarDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDevices();
    }
  }, [user]);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('/api/devices');
      let filteredDevices = response.data;

      // Filter devices based on user role
      if (user && user.role !== 'ADMIN' && user.traccarDeviceIds.length > 0) {
        filteredDevices = response.data.filter((device: TraccarDevice) =>
          user.traccarDeviceIds.includes(device.id)
        );
      }

      setDevices(filteredDevices);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚗</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Vehicles</h1>
            <p className="text-xs text-gray-500">{devices.length} vehicles</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 truncate">{device.name}</h3>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>ID:</span>
                    <span className="font-medium">{device.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${device.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                      {device.status}
                    </span>
                  </div>
                  {device.lastUpdate && (
                    <div className="flex items-center justify-between">
                      <span>Last Update:</span>
                      <span className="text-xs">{new Date(device.lastUpdate).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
