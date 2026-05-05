import { create } from 'zustand';
import type { Session, SessionMetrics, SessionStatus } from '../types';
import { generateId } from '../utils/helpers';

interface SessionState {
  currentSession: Session | null;
  sessions: Session[];
  status: SessionStatus;

  startSession: (userId: string, sport?: string) => void;
  stopSession: (metrics: SessionMetrics) => void;
  updateMetrics: (metrics: Partial<SessionMetrics>) => void;
  setSessions: (sessions: Session[]) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  sessions: [],
  status: 'idle',

  startSession: (userId, sport = 'general') => {
    const session: Session = {
      id: generateId(),
      userId,
      startedAt: Date.now(),
      endedAt: null,
      status: 'recording',
      sport,
      metrics: {
        duration: 0,
        distance: 0,
        maxSpeed: 0,
        avgSpeed: 0,
        totalPoints: 0,
      },
    };
    set({ currentSession: session, status: 'recording' });
  },

  stopSession: (metrics) => {
    const current = get().currentSession;
    if (!current) return;
    const completed: Session = {
      ...current,
      endedAt: Date.now(),
      status: 'completed',
      metrics,
    };
    set((state) => ({
      currentSession: null,
      status: 'idle',
      sessions: [completed, ...state.sessions],
    }));
  },

  updateMetrics: (metrics) =>
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          metrics: { ...state.currentSession.metrics, ...metrics },
        },
      };
    }),

  setSessions: (sessions) => set({ sessions }),
}));
