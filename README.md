# Statifly — Sport Performance Tracker

React Native + Expo (TypeScript) app that connects to an ESP32 sensor via BLE
to capture and visualize real-time sport performance data.

## Quick Start

```bash
# Install dependencies
npm install
# or
bun install

# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

> **Note**: BLE features require a dev build (`npx expo run:ios`), not Expo Go.
> In development mode, the app uses a mock BLE manager that generates fake data.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── BleStatusBadge.tsx
│   ├── MetricCard.tsx
│   └── SessionCard.tsx
├── screens/            # Screen components
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LiveSessionScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/
│   └── AppNavigator.tsx   # Stack + Tab navigation
├── store/              # Zustand state management
│   ├── useAuthStore.ts
│   ├── useBleStore.ts
│   └── useSessionStore.ts
├── services/
│   ├── ble/
│   │   └── bleManager.ts  # BLE abstraction (mock + real)
│   └── storage/
│       └── sessionStorage.ts  # Local persistence (SQLite-ready)
├── hooks/
│   ├── useBle.ts          # BLE connection + data hook
│   └── useLiveMetrics.ts  # Derived real-time metrics
├── utils/
│   ├── theme.ts           # Design tokens (dark + green)
│   └── helpers.ts         # Haversine, formatters, etc.
└── types/
    └── index.ts           # All TypeScript interfaces
```

## Architecture

### Data Flow

```
ESP32 (BLE) → bleManager → useBle hook → useBleStore (Zustand)
                                              ↓
                                    throttled pushMetricPoint
                                              ↓
                              useLiveMetrics → UI (MetricCards, Map)
                                              ↓
                              useSessionStore → computed metrics
                                              ↓
                              sessionStorage → SQLite (offline-first)
```

### Performance Patterns

- **Throttling**: UI updates are throttled to ~5 Hz (200ms) even if BLE sends at 10+ Hz.
- **Selective subscriptions**: Components subscribe to specific Zustand selectors to avoid unnecessary re-renders.
- **Buffer management**: Only the last 500 points are kept in the UI buffer; all points are stored in a ref for metric computation.
- **Batching**: Metric calculations use the full point array, not individual pushes.

### BLE Protocol

The ESP32 sends JSON packets over BLE with this structure:

```typescript
{
  t: number,    // timestamp (ms)
  lat: number,  // GPS latitude
  lng: number,  // GPS longitude
  spd: number,  // speed (m/s)
  acc: number,  // acceleration (m/s²)
  gx: number,   // gyroscope X (°/s)
  gy: number,   // gyroscope Y (°/s)
  gz: number    // gyroscope Z (°/s)
}
```

### Switching from Mock to Real BLE

In `src/services/ble/bleManager.ts`, change `USE_MOCK` to `false` and implement
the TODO sections using `react-native-ble-plx`. You'll need:

1. Your ESP32's BLE Service UUID
2. The Characteristic UUID for data notifications
3. A dev build (not Expo Go) with BLE permissions configured

## Design System

Dark theme with lime-green accents:

| Token          | Value      |
|----------------|------------|
| Background     | `#0D0D0D`  |
| Card           | `#1A1A1A`  |
| Primary (lime) | `#A8E847`  |
| Text Primary   | `#FFFFFF`  |
| Text Secondary | `#A0A0A0`  |
| Error          | `#EF4444`  |

## Roadmap

- [ ] Real BLE integration with react-native-ble-plx
- [ ] SQLite persistence (expo-sqlite)
- [ ] Backend sync API (offline-first)
- [ ] Multiple sport profiles
- [ ] Session replay with trajectory playback
- [ ] Heart rate monitor support
- [ ] Export sessions (GPX, CSV)
