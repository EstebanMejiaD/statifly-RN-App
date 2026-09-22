// ─── BLE & Sensor ───────────────────────────────────────────

export interface MetricPoint {
  t: number;       // timestamp (ms)
  lat: number;     // latitude
  lng: number;     // longitude
  spd: number;     // speed (m/s)
  acc: number;     // acceleration (m/s²)
  gx: number;      // gyro X
  gy: number;      // gyro Y
  gz: number;      // gyro Z
}

export type BleConnectionStatus =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface BleDevice {
  id: string;
  name: string | null;
  rssi: number | null;
}

// ─── Sessions ───────────────────────────────────────────────


// ─── User ───────────────────────────────────────────────────

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
// }

// ─── Navigation ─────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  LiveSession: undefined;
  SessionDetail: { sessionId: string };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};
