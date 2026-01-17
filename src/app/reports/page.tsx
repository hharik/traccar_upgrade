'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

export default function ReportsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-xs text-gray-500">Generate fleet reports</p>
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
          <div className="text-6xl mb-4">�</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports Coming Soon</h2>
          <p className="text-gray-600 mb-6">Generate detailed reports on routes, stops, fuel consumption, and more</p>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">🚗</div>
              <h3 className="font-semibold text-gray-900">Trip Reports</h3>
              <p className="text-sm text-gray-600">Detailed route history</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold text-gray-900">Time Reports</h3>
              <p className="text-sm text-gray-600">Driving & idle time</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">📍</div>
              <h3 className="font-semibold text-gray-900">Stop Reports</h3>
              <p className="text-sm text-gray-600">Stop locations & duration</p>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
