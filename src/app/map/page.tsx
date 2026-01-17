'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { TraccarDevice, TraccarPosition } from '@/types/traccar';

// Import MapView dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [devices, setDevices] = useState<TraccarDevice[]>([]);
  const [positions, setPositions] = useState<TraccarPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
      // Set up polling for real-time updates
      const interval = setInterval(fetchData, 10000); // Update every 10 seconds for map
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchData = async () => {
    try {
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

      // Filter devices based on user's assigned device IDs (if not admin)
      let filteredDevices = devicesData;
      if (user && user.role !== 'ADMIN' && user.traccarDeviceIds.length > 0) {
        filteredDevices = devicesData.filter((device: TraccarDevice) => 
          user.traccarDeviceIds.includes(device.id)
        );
      }

      console.log('[MapPage] Fetched devices:', devicesData.length);
      console.log('[MapPage] Fetched positions:', positionsData.length);
      console.log('[MapPage] Filtered devices:', filteredDevices.length);
      console.log('[MapPage] First device:', devicesData[0]);
      console.log('[MapPage] First position:', positionsData[0]);

      setDevices(filteredDevices);
      setPositions(positionsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <div className="h-[calc(100vh-73px)] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your fleet...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="h-[calc(100vh-73px)] flex items-center justify-center bg-gray-100">
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
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col relative">
      {/* User Header */}
      <div className="bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between z-[9998]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Welcome,</span>
          <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
          {user?.role === 'ADMIN' && (
            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-hidden pb-[70px]">
        <MapView devices={devices} positions={positions} />
      </div>
      <Navigation />
    </div>
  );
}
