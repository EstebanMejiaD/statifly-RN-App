/**
 * Local session storage using expo-sqlite.
 *
 * Stores sessions and metric points for offline-first architecture.
 * Designed for future sync with a remote backend.
 */

import type { Session, MetricPoint } from '../../types';

// In a real implementation you'd use expo-sqlite:
// import * as SQLite from 'expo-sqlite';

const sessionsDB: Session[] = [];
const pointsDB: Map<string, MetricPoint[]> = new Map();

export const sessionStorage = {
  async init(): Promise<void> {
    // TODO: Create SQLite tables
    // CREATE TABLE sessions (id TEXT PK, userId TEXT, startedAt INTEGER, ...);
    // CREATE TABLE metric_points (id INTEGER PK AUTOINCREMENT, sessionId TEXT, t INTEGER, lat REAL, ...);
    console.log('[Storage] Initialized');
  },

  async saveSession(session: Session): Promise<void> {
    sessionsDB.unshift(session);
  },

  async saveMetricPoints(sessionId: string, points: MetricPoint[]): Promise<void> {
    const existing = pointsDB.get(sessionId) ?? [];
    pointsDB.set(sessionId, [...existing, ...points]);
  },

  async getSessions(userId: string): Promise<Session[]> {
    return sessionsDB.filter((s) => s.userId === userId);
  },

  async getSessionPoints(sessionId: string): Promise<MetricPoint[]> {
    return pointsDB.get(sessionId) ?? [];
  },

  async deleteSession(sessionId: string): Promise<void> {
    const idx = sessionsDB.findIndex((s) => s.id === sessionId);
    if (idx !== -1) sessionsDB.splice(idx, 1);
    pointsDB.delete(sessionId);
  },

  /** Mark sessions as synced (for future backend sync). */
  async markSynced(sessionIds: string[]): Promise<void> {
    // TODO: UPDATE sessions SET syncedAt = ? WHERE id IN (?)
    console.log('[Storage] Marked synced:', sessionIds);
  },

  /** Get sessions pending sync. */
  async getUnsyncedSessions(): Promise<Session[]> {
    // TODO: SELECT * FROM sessions WHERE syncedAt IS NULL
    return sessionsDB;
  },
};
