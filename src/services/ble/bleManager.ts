/**
 * BLE Manager — abstraction over react-native-ble-plx.
 *
 * In development/simulator mode this uses a mock that generates
 * fake GPS+IMU data so you can test the full pipeline without hardware.
 *
 * Switch USE_MOCK to false when testing with a real ESP32.
 */

import type { MetricPoint, BleDevice } from '../../types';

const USE_MOCK = true; // auto-mock in dev

// ─── Mock Data Generator ────────────────────────────────────

let mockInterval: ReturnType<typeof setInterval> | null = null;
let mockLat = 40.4168;  // Madrid
let mockLng = -3.7038;

function generateMockPoint(): MetricPoint {
  mockLat += (Math.random() - 0.5) * 0.0002;
  mockLng += (Math.random() - 0.5) * 0.0002;
  return {
    t: Date.now(),
    lat: mockLat,
    lng: mockLng,
    spd: 2 + Math.random() * 8,        // 2–10 m/s
    acc: (Math.random() - 0.5) * 4,     // -2 to 2 m/s²
    gx: (Math.random() - 0.5) * 500,
    gy: (Math.random() - 0.5) * 500,
    gz: (Math.random() - 0.5) * 500,
  };
}

// ─── Public API ─────────────────────────────────────────────

export type OnDataCallback = (point: MetricPoint) => void;

export async function scanDevices(
  onFound: (device: BleDevice) => void,
): Promise<void> {
  if (USE_MOCK) {
    // Simulate finding a device after 1.5s
    setTimeout(() => {
      onFound({ id: 'mock-esp32-001', name: 'Statifly Sensor', rssi: -55 });
    }, 1500);
    return;
  }

  // TODO: Real BLE scan using BleManager from react-native-ble-plx
  // const manager = new BleManager();
  // manager.startDeviceScan(null, null, (error, device) => { ... });
}

export async function connectDevice(
  deviceId: string,
  onData: OnDataCallback,
): Promise<void> {
  if (USE_MOCK) {
    // Stream mock data at ~10 Hz
    mockInterval = setInterval(() => {
      onData(generateMockPoint());
    }, 100);
    return;
  }

  // TODO: Real BLE connect + subscribe to characteristic
}

export function disconnectDevice(): void {
  if (mockInterval) {
    clearInterval(mockInterval);
    mockInterval = null;
  }
  // TODO: Real BLE disconnect
}

export function isConnected(): boolean {
  return USE_MOCK ? mockInterval !== null : false;
}
