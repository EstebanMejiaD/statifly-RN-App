import { useCallback, useRef } from 'react';
import { useBleStore } from '../store/useBleStore';
import { useSessionStore } from '../store/useSessionStore';
import * as bleManager from '../services/ble/bleManager';
import { totalDistance, msToKmh } from '../utils/helpers';
import type { MetricPoint } from '../types';

const THROTTLE_MS = 200; // Update UI at max ~5 Hz

export function useBle() {
  const store = useBleStore();
  const sessionStore = useSessionStore();
  const lastUIUpdate = useRef(0);
  const allPoints = useRef<MetricPoint[]>([]);

  const scan = useCallback(() => {
    store.setStatus('scanning');
    store.clearDiscoveredDevices();
    bleManager.scanDevices((device) => {
      store.addDiscoveredDevice(device);
    });
  }, []);

  const connect = useCallback((deviceId: string) => {
    store.setStatus('connecting');
    allPoints.current = [];

    bleManager.connectDevice(deviceId, (point) => {
      // Always accumulate for metrics
      allPoints.current.push(point);

      // Throttle UI updates
      const now = Date.now();
      if (now - lastUIUpdate.current < THROTTLE_MS) return;
      lastUIUpdate.current = now;

      store.pushMetricPoint(point);

      // Update session metrics if recording
      if (sessionStore.status === 'recording') {
        const pts = allPoints.current;
        const durationSec = (point.t - pts[0].t) / 1000;
        const dist = totalDistance(pts);
        const maxSpd = Math.max(...pts.map((p) => p.spd));
        const avgSpd = pts.reduce((sum, p) => sum + p.spd, 0) / pts.length;

        sessionStore.updateMetrics({
          duration: durationSec,
          distance: dist,
          maxSpeed: maxSpd,
          avgSpeed: avgSpd,
          totalPoints: pts.length,
        });
      }
    });

    store.setConnectedDevice({
      id: deviceId,
      name: 'Statifly Sensor',
      rssi: null,
    });
  }, []);

  const disconnect = useCallback(() => {
    bleManager.disconnectDevice();
    store.setConnectedDevice(null);
    store.clearBuffer();
    allPoints.current = [];
  }, []);

  return {
    ...store,
    scan,
    connect,
    disconnect,
    allPoints,
  };
}
