'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  traccarDeviceIds: number[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/session');
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    } catch (error) {
      setUser(null);
      if (pathname !== '/login') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { adminOnly?: boolean }
) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
        } else if (options?.adminOnly && user.role !== 'ADMIN') {
          router.push('/map');
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (!user || (options?.adminOnly && user.role !== 'ADMIN')) {
      return null;
    }

    return <Component {...props} />;
  };
}
