import axios, { AxiosInstance } from 'axios';
import type {
  TraccarDevice,
  TraccarPosition,
  TraccarTrip,
  TraccarGeofence,
  TraccarUser,
} from '@/types/traccar';

class TraccarService {
  private api: AxiosInstance;
  private sessionCookie: string | null = null;

  constructor() {
    const username = process.env.TRACCAR_API_USERNAME || 'admin';
    const password = process.env.TRACCAR_API_PASSWORD || 'admin';
    
    this.api = axios.create({
      baseURL: process.env.TRACCAR_API_URL || 'http://localhost:8082/api',
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false, // Don't use credentials for Basic Auth
      timeout: 15000, // 15 second timeout
    });
  }

  /**
   * Authenticate with Traccar server
   */
  async login(email: string, password: string): Promise<TraccarUser> {
    try {
      const response = await this.api.post<TraccarUser>('/session', null, {
        params: { email, password },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Authentication failed');
    }
  }

  /**
   * Get current session user
   */
  async getSession(): Promise<TraccarUser> {
    try {
      const response = await this.api.get<TraccarUser>('/session');
      return response.data;
    } catch (error: any) {
      throw new Error('Session not found or expired');
    }
  }

  /**
   * Logout from Traccar
   */
  async logout(): Promise<void> {
    try {
      await this.api.delete('/session');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Get all devices
   */
  async getDevices(): Promise<TraccarDevice[]> {
    try {
      const response = await this.api.get<TraccarDevice[]>('/devices');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch devices');
    }
  }

  /**
   * Get a specific device by ID
   */
  async getDevice(deviceId: number): Promise<TraccarDevice> {
    try {
      const response = await this.api.get<TraccarDevice>(`/devices/${deviceId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch device');
    }
  }

  /**
   * Get all positions
   */
  async getPositions(deviceId?: number): Promise<TraccarPosition[]> {
    try {
      const params = deviceId ? { deviceId } : {};
      const response = await this.api.get<TraccarPosition[]>('/positions', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch positions');
    }
  }

  /**
   * Get latest position for a device
   */
  async getLatestPosition(deviceId: number): Promise<TraccarPosition | null> {
    try {
      const positions = await this.getPositions(deviceId);
      return positions.length > 0 ? positions[0] : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get trip reports
   */
  async getTrips(
    deviceId: number,
    from: Date,
    to: Date
  ): Promise<TraccarTrip[]> {
    try {
      const response = await this.api.get<TraccarTrip[]>('/reports/trips', {
        params: {
          deviceId,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trips');
    }
  }

  /**
   * Get all geofences
   */
  async getGeofences(): Promise<TraccarGeofence[]> {
    try {
      const response = await this.api.get<TraccarGeofence[]>('/geofences');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch geofences');
    }
  }

  /**
   * Create a new geofence
   */
  async createGeofence(geofence: Partial<TraccarGeofence>): Promise<TraccarGeofence> {
    try {
      const response = await this.api.post<TraccarGeofence>('/geofences', geofence);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create geofence');
    }
  }

  /**
   * Get summary report
   */
  async getSummary(deviceId: number, from: Date, to: Date): Promise<any> {
    try {
      const response = await this.api.get('/reports/summary', {
        params: {
          deviceId,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch summary');
    }
  }

  /**
   * Get route (positions history)
   */
  async getRoute(deviceId: number, from: Date, to: Date): Promise<TraccarPosition[]> {
    try {
      const response = await this.api.get<TraccarPosition[]>('/reports/route', {
        params: {
          deviceId,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch route');
    }
  }

  /**
   * Set authentication for subsequent requests
   */
  setAuth(email: string, password: string) {
    this.api.defaults.auth = { username: email, password };
  }
}

// Export singleton instance
export const traccarService = new TraccarService();
export default TraccarService;
