export interface MetricPoint {
  id: string;
  sessionId: string;

  timestamp: number;

  lat: number;
  lng: number;

  speed: number;
  acceleration: number;

  gx: number;
  gy: number;
  gz: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMetricPointDto {
  sessionId: string;

  timestamp: number;

  lat: number;
  lng: number;

  speed: number;
  acceleration: number;

  gx: number;
  gy: number;
  gz: number;
}

export interface BulkMetricPoint {
  timestamp: number;

  lat: number;
  lng: number;

  speed: number;
  acceleration: number;

  gx: number;
  gy: number;
  gz: number;
}

export interface BulkMetricPointsDto {
  metrics: BulkMetricPoint[];
}