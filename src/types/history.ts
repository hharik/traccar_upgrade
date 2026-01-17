export interface RoutePoint {
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  altitude: number;
  fixTime: string;
  serverTime: string;
  address?: string;
}

export interface HistoryFilter {
  deviceId: number;
  from: string; // ISO date string
  to: string;   // ISO date string
}
