'use client';

import Link from 'next/link';

export default function LandingPage() {
  const phoneNumber = '+212708401683';
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[\s-]/g, '')}?text=Hello,%20I'm%20interested%20in%20your%20GPS%20tracking%20services`;
  const callLink = `tel:${phoneNumber}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚗</span>
            <span className="text-2xl font-bold">FollowTrack</span>
          </div>
          <Link
            href="/login"
            className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
        </nav>

        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Track Your Fleet in Real-Time
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Professional GPS tracking solution for businesses. Monitor 48+ vehicles with live location, 
            detailed reports, and intelligent alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contact via WhatsApp
            </a>
            <a
              href={callLink}
              className="px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call {phoneNumber}
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Complete Fleet Management Solution
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to monitor, manage, and optimize your vehicle fleet
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Live Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor all your vehicles in real-time on an interactive map. See exact locations, 
                speed, and status updates every 10 seconds.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Detailed Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate comprehensive reports on routes, stops, driving time, top speeds, 
                and total distance traveled for any time period.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Route Playback</h3>
              <p className="text-gray-600 leading-relaxed">
                Replay historical routes with animation controls. Review any vehicle's journey 
                with speed playback from 1x to 10x.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Geofencing</h3>
              <p className="text-gray-600 leading-relaxed">
                Create virtual boundaries and receive instant alerts when vehicles 
                enter or exit designated zones.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Get notified about speeding violations, unauthorized movements, 
                maintenance reminders, and more.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Multi-User Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Create separate accounts for clients with customized vehicle access. 
                Secure admin panel for complete control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">48+</div>
              <div className="text-indigo-200">Active Vehicles</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-indigo-200">Live Monitoring</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10s</div>
              <div className="text-indigo-200">Update Frequency</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-indigo-200">Secure Platform</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Get started with our GPS tracking solution in three simple steps
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="flex-shrink-0 w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-600">
                  Reach out via WhatsApp or phone call. We'll discuss your fleet size, 
                  requirements, and provide a customized solution.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="flex-shrink-0 w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Setup & Configuration</h3>
                <p className="text-gray-600">
                  We'll create your account, configure your vehicles, and provide 
                  access credentials. Training included.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Tracking</h3>
                <p className="text-gray-600">
                  Log in to your dashboard and start monitoring your fleet immediately. 
                  24/7 support available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Track Your Fleet?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get in touch with us today and start monitoring your vehicles with our 
            professional GPS tracking solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Message on WhatsApp
            </a>
            <a
              href={callLink}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-3xl">🚗</span>
              <span className="text-2xl font-bold">FollowTrack</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">Professional GPS Fleet Tracking</p>
              <p className="text-gray-400">
                Contact: <a href={callLink} className="text-indigo-400 hover:text-indigo-300">{phoneNumber}</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 FollowTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
