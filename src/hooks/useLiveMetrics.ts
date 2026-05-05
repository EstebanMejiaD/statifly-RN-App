/**
 * Derived live metrics from the BLE store — throttled selector
 * to avoid re-rendering on every data point.
 */
import { useBleStore } from '../store/useBleStore';
import { msToKmh } from '../utils/helpers';

export function useLiveMetrics() {
  const lastPoint = useBleStore((s) => s.lastPoint);

  if (!lastPoint) {
    return {
      speed: 0,
      speedKmh: '0.0',
      acceleration: 0,
      lat: 0,
      lng: 0,
      timestamp: 0,
    };
  }

  return {
    speed: lastPoint.spd,
    speedKmh: msToKmh(lastPoint.spd).toFixed(1),
    acceleration: lastPoint.acc,
    lat: lastPoint.lat,
    lng: lastPoint.lng,
    timestamp: lastPoint.t,
  };
}
