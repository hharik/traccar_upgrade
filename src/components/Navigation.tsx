'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { name: 'Map', href: '/map', icon: '�️', roles: ['ADMIN', 'CLIENT'] },
    { name: 'Vehicles', href: '/vehicles', icon: '🚗', roles: ['ADMIN', 'CLIENT'] },
    { name: 'Reports', href: '/reports', icon: '📈', roles: ['ADMIN', 'CLIENT'] },
    { name: 'Geofences', href: '/geofences', icon: '📍', roles: ['ADMIN', 'CLIENT'] },
    { name: 'Alerts', href: '/alerts', icon: '🔔', roles: ['ADMIN', 'CLIENT'] },
    { name: 'Admin', href: '/admin', icon: '👤', roles: ['ADMIN'] },
  ];

  // Filter nav items based on user role
  const visibleItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-[9999]">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[60px] ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <span className={`text-xl ${isActive ? 'animate-bounce-subtle' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium leading-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
