export type PlaygroundType =
  | 'FOOTBALL_5'
  | 'FOOTBALL_7'
  | 'FOOTBALL_8'
  | 'FOOTBALL_11'
  | string;

export interface PlaygroundCoordinate {
  lat: number;
  lng: number;
}

export interface PlaygroundDimensions {
  length: number;
  width: number;
  unit: string;
}

export interface Playground {
  id: string;
  name: string;
  sportId: string;
  type: PlaygroundType;
  coordinates: PlaygroundCoordinate[];
  dimensions?: PlaygroundDimensions;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlaygroundDto {
  name: string;
  sportId: string;
  type: PlaygroundType;
  coordinates: PlaygroundCoordinate[];
  dimensions?: PlaygroundDimensions;
  createdBy: string;
}

export interface UpdatePlaygroundDto {
  name?: string;
  sportId?: string;
  type?: PlaygroundType;
  coordinates?: PlaygroundCoordinate[];
  dimensions?: PlaygroundDimensions;
}