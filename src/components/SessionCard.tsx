import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize } from '../utils/theme';
import { formatDuration, msToKmh } from '../utils/helpers';
import type { Session } from '../types';

interface SessionCardProps {
  session: Session;
  onPress?: () => void;
}

export function SessionCard({ session, onPress }: SessionCardProps) {
  const date = new Date(session.startedAt);
  const dateStr = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="fitness" size={20} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.sport}>{session.sport}</Text>
          <Text style={styles.date}>{dateStr} · {timeStr}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{formatDuration(session.metrics.duration)}</Text>
          <Text style={styles.metricLabel}>Duration</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{(session.metrics.distance / 1000).toFixed(2)}</Text>
          <Text style={styles.metricLabel}>km</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{msToKmh(session.metrics.maxSpeed).toFixed(1)}</Text>
          <Text style={styles.metricLabel}>Max km/h</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{msToKmh(session.metrics.avgSpeed).toFixed(1)}</Text>
          <Text style={styles.metricLabel}>Avg km/h</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sport: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
