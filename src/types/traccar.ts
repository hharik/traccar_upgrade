// Traccar API Types

export interface TraccarDevice {
  id: number;
  name: string;
  uniqueId: string;
  status: string;
  disabled: boolean;
  lastUpdate: string;
  positionId: number;
  groupId?: number;
  phone?: string;
  model?: string;
  contact?: string;
  category?: string;
  attributes?: Record<string, any>;
}

export interface TraccarPosition {
  id: number;
  deviceId: number;
  protocol: string;
  deviceTime: string;
  fixTime: string;
  serverTime: string;
  outdated: boolean;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: number;
  address?: string;
  accuracy?: number;
  network?: any;
  attributes?: Record<string, any>;
}

export interface TraccarTrip {
  deviceId: number;
  deviceName: string;
  maxSpeed: number;
  averageSpeed: number;
  distance: number;
  duration: number;
  startTime: string;
  endTime: string;
  startOdometer: number;
  endOdometer: number;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  startAddress?: string;
  endAddress?: string;
}

export interface TraccarGeofence {
  id: number;
  name: string;
  description?: string;
  area: string;
  calendarId?: number;
  attributes?: Record<string, any>;
}

export interface TraccarUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  readonly: boolean;
  administrator: boolean;
  disabled: boolean;
  expirationTime?: string;
  deviceLimit: number;
  userLimit: number;
  token?: string;
  attributes?: Record<string, any>;
}
