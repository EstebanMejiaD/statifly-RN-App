export interface FlyHomeStatus {
  connected: boolean;
  batteryLevel: number | null;
  pendingSessions: number;
  pendingSessionDurationMinutes: number | null;
}

export interface WeeklyMetric {
  id: string;
  title: string;
  value: string | number | null;
  unit?: string;
  subtitle?: string;
  icon:
    | 'trending-up'
    | 'flash'
    | 'time-outline';
}

export interface HomeSessionSummary {
  id: string;
  name: string;
  sport: string;
  dateLabel: string;
  durationMinutes: number;
  distanceKm?: number;
  maxSpeedKmh?: number;
  intensityScore?: number;
}

export interface HomeData {
  fly: FlyHomeStatus;
  weeklyMetrics: WeeklyMetric[];
  lastSession: HomeSessionSummary | null;
  recentSessions: HomeSessionSummary[];
}