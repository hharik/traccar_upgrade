'use client';

import Navigation from '@/components/Navigation';

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicles Management</h1>
          <p className="text-gray-600">Coming soon - Manage your vehicle fleet</p>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
