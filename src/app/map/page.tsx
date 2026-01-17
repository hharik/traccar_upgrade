'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
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
  const [devices, setDevices] = useState<TraccarDevice[]>([]);
  const [positions, setPositions] = useState<TraccarPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds for map
    return () => clearInterval(interval);
  }, []);

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

      console.log('[MapPage] Fetched devices:', devicesData.length);
      console.log('[MapPage] Fetched positions:', positionsData.length);
      console.log('[MapPage] First device:', devicesData[0]);
      console.log('[MapPage] First position:', positionsData[0]);

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

  if (loading) {
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
      <div className="flex-1 overflow-hidden pb-[70px]">
        <MapView devices={devices} positions={positions} />
      </div>
      <Navigation />
    </div>
  );
}
