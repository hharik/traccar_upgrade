'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

export default function AlertsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔔</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-xs text-gray-500">Manage fleet alerts</p>
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
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Alert System Coming Soon</h2>
          <p className="text-gray-600 mb-6">Set up instant notifications for speeding, geofencing, maintenance, and more</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
