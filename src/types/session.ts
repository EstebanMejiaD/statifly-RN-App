export interface SessionAdditionalData {
  isAGame?: boolean;

  result?: {
    local: number;
    visit: number;
  };

  goals?: number;
  assistance?: number;
  cards?: number;
  positionInGame?: string;

  perceivedExertion?: number;

  [key: string]: unknown;
}

export interface Session {
  id: string;
  userId: string;
  sportId: string;
  playgroundId?: string | null;

  name: string;
  description?: string | null;

  startTime: string;
  endTime?: string | null;

  duration?: number | null;
  distance?: number | null;
  maxSpeed?: number | null;
  avgSpeed?: number | null;

  additionalData?: SessionAdditionalData | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSessionDto {
  userId: string;
  sportId: string;
  playgroundId?: string;

  name: string;
  description?: string;

  startTime: string;
  endTime?: string;

  duration?: number;
  distance?: number;
  maxSpeed?: number;
  avgSpeed?: number;

  additionalData?: SessionAdditionalData;
}

export interface UpdateSessionDto {
  sportId?: string;
  playgroundId?: string;

  name?: string;
  description?: string;

  startTime?: string;
  endTime?: string;

  duration?: number;
  distance?: number;
  maxSpeed?: number;
  avgSpeed?: number;

  additionalData?: SessionAdditionalData;
}