import { create } from 'zustand';
import type { BleConnectionStatus, BleDevice, MetricPoint } from '../types';

const MAX_BUFFER_SIZE = 500; // keep last N points in memory

interface BleState {
  status: BleConnectionStatus;
  connectedDevice: BleDevice | null;
  discoveredDevices: BleDevice[];
  liveBuffer: MetricPoint[];
  lastPoint: MetricPoint | null;
  error: string | null;

  // Actions
  setStatus: (status: BleConnectionStatus) => void;
  setConnectedDevice: (device: BleDevice | null) => void;
  addDiscoveredDevice: (device: BleDevice) => void;
  clearDiscoveredDevices: () => void;
  pushMetricPoint: (point: MetricPoint) => void;
  clearBuffer: () => void;
  setError: (error: string | null) => void;
}

export const useBleStore = create<BleState>((set) => ({
  status: 'disconnected',
  connectedDevice: null,
  discoveredDevices: [],
  liveBuffer: [],
  lastPoint: null,
  error: null,

  setStatus: (status) => set({ status }),

  setConnectedDevice: (device) =>
    set({ connectedDevice: device, status: device ? 'connected' : 'disconnected' }),

  addDiscoveredDevice: (device) =>
    set((state) => {
      const exists = state.discoveredDevices.some((d) => d.id === device.id);
      if (exists) return state;
      return { discoveredDevices: [...state.discoveredDevices, device] };
    }),

  clearDiscoveredDevices: () => set({ discoveredDevices: [] }),

  pushMetricPoint: (point) =>
    set((state) => {
      const buffer =
        state.liveBuffer.length >= MAX_BUFFER_SIZE
          ? [...state.liveBuffer.slice(-MAX_BUFFER_SIZE + 1), point]
          : [...state.liveBuffer, point];
      return { liveBuffer: buffer, lastPoint: point };
    }),

  clearBuffer: () => set({ liveBuffer: [], lastPoint: null }),

  setError: (error) => set({ error }),
}));
