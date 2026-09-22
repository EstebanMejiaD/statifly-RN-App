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

interface LastSessionCardProps {
  session: HomeSessionSummary | null;
  onPress?: () => void;
}

export function LastSessionCard({
  session,
  onPress,
}: LastSessionCardProps) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          ÚLTIMA SESIÓN PROCESADA
        </Text>

        {session && (
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.action}>
              VER REPORTE →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!session ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="analytics-outline"
              size={30}
              color={colors.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Aún no tienes sesiones
          </Text>

          <Text style={styles.emptyDescription}>
            Cuando sincronices tu primera actividad
            con Fly aparecerá aquí su resumen.
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.card}
        >
          <View style={styles.field}>
            <View style={styles.fieldBorder}>
              <View style={styles.middleLine} />
              <View style={styles.centerCircle} />
            </View>

            <View style={styles.heatPointOne} />
            <View style={styles.heatPointTwo} />

            <View style={styles.heatLabel}>
              <Text style={styles.heatLabelText}>
                MAPA DE INTENSIDAD
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.sport}>
              {session.sport.toUpperCase()} ·{' '}
              {session.dateLabel.toUpperCase()}
            </Text>

            <Text style={styles.title}>
              {session.name}
            </Text>

            <View style={styles.metrics}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>
                  DISTANCIA TOTAL
                </Text>

                <Text style={styles.metricValue}>
                  {session.distanceKm ?? '—'}
                  {session.distanceKm !== undefined && (
                    <Text style={styles.metricUnit}>
                      {' '}KM
                    </Text>
                  )}
                </Text>
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricLabel}>
                  VELOCIDAD MÁX.
                </Text>

                <Text style={styles.metricValue}>
                  {session.maxSpeedKmh ?? '—'}
                  {session.maxSpeedKmh !== undefined && (
                    <Text style={styles.metricUnit}>
                      {' '}KM/H
                    </Text>
                  )}
                </Text>
              </View>
            </View>

            {session.intensityScore !== undefined && (
              <View style={styles.intensity}>
                <Text style={styles.metricLabel}>
                  INTENSIDAD
                </Text>

                <View style={styles.intensityRow}>
                  <Text style={styles.intensityValue}>
                    {session.intensityScore}/100
                  </Text>

                  <View style={styles.progress}>
                    <View
                      style={[
                        styles.progressValue,
                        {
                          width: `${Math.min(
                            session.intensityScore,
                            100,
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
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

  headerTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.1,
  },

  action: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: colors.bgCard,
    minHeight: 220,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },

  emptyDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 280,
  },

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  field: {
    height: 210,
    backgroundColor: '#11150D',
    padding: spacing.md,
    overflow: 'hidden',
  },

  fieldBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
  },

  middleLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: colors.border,
  },

  centerCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.borderLight,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -35 },
      { translateY: -35 },
    ],
  },

  heatPointOne: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.primaryMuted,
    left: 30,
    top: 40,
  },

  heatPointTwo: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryMuted,
    right: 35,
    bottom: 25,
  },

  heatLabel: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },

  heatLabelText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.7,
  },

  content: {
    padding: spacing.lg,
  },

  sport: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: spacing.sm,
  },

  metrics: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.xl,
  },

  metric: {
    flex: 1,
  },

  metricLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  metricValue: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: spacing.xs,
  },

  metricUnit: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },

  intensity: {
    marginTop: spacing.lg,
  },

  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  intensityValue: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },

  progress: {
    flex: 1,
    height: 5,
    backgroundColor: colors.bgCardLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },

  progressValue: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});