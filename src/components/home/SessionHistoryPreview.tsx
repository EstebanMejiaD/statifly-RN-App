import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { HomeSessionSummary } from '../../types/home';

import {
  colors,
  spacing,
  fontSize,
  borderRadius,
} from '../../utils/theme';

interface SessionHistoryPreviewProps {
  sessions: HomeSessionSummary[];
  onViewAll: () => void;
  onSessionPress?: (session: HomeSessionSummary) => void;
}

export function SessionHistoryPreview({
  sessions,
  onViewAll,
  onSessionPress,
}: SessionHistoryPreviewProps) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>
          HISTORIAL
        </Text>

        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>
            VER TODO
          </Text>
        </TouchableOpacity>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="time-outline"
            size={28}
            color={colors.textMuted}
          />

          <Text style={styles.emptyTitle}>
            Sin sesiones todavía
          </Text>

          <Text style={styles.emptyText}>
            Tus actividades aparecerán aquí después
            de sincronizar Fly.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {sessions.slice(0, 3).map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.row}
              activeOpacity={0.75}
              onPress={() =>
                onSessionPress?.(session)
              }
            >
              <View style={styles.icon}>
                <Ionicons
                  name={
                    session.sport.toLowerCase() ===
                    'fútbol'
                      ? 'football-outline'
                      : 'fitness-outline'
                  }
                  size={21}
                  color={colors.primary}
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.sessionName}>
                  {session.name}
                </Text>

                <Text style={styles.sessionMeta}>
                  {session.dateLabel} ·{' '}
                  {session.durationMinutes} min
                  {session.distanceKm !== undefined
                    ? ` · ${session.distanceKm} km`
                    : ''}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  title: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.1,
  },

  viewAll: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },

  list: {
    gap: spacing.sm,
  },

  row: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
    marginLeft: spacing.md,
  },

  sessionName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  sessionMeta: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },

  empty: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.md,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: spacing.sm,
  },
});