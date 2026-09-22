import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { WeeklyMetric } from '../../types/home';

import {
  colors,
  spacing,
  fontSize,
  borderRadius,
} from '../../utils/theme';

interface WeeklyMetricsProps {
  metrics: WeeklyMetric[];
}

export function WeeklyMetrics({
  metrics,
}: WeeklyMetricsProps) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          RENDIMIENTO SEMANAL
        </Text>

        <Text style={styles.sectionAction}>
          ESTA SEMANA
        </Text>
      </View>

      <View style={styles.grid}>
        {metrics.map((metric, index) => {
          const fullWidth = index === 2;

          return (
            <View
              key={metric.id}
              style={[
                styles.card,
                fullWidth
                  ? styles.fullCard
                  : styles.halfCard,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.metricTitle}>
                  {metric.title}
                </Text>

                <Ionicons
                  name={metric.icon}
                  size={19}
                  color={colors.primary}
                />
              </View>

              <View>
                <View style={styles.valueRow}>
                  <Text style={styles.value}>
                    {metric.value ?? '—'}
                  </Text>

                  {metric.value !== null &&
                    metric.unit && (
                      <Text style={styles.unit}>
                        {metric.unit}
                      </Text>
                    )}
                </View>

                {!!metric.subtitle && (
                  <Text style={styles.subtitle}>
                    {metric.subtitle}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  sectionAction: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },

  card: {
    minHeight: 126,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
  },

  halfCard: {
    flexBasis: '47%',
    flexGrow: 1,
  },

  fullCard: {
    width: '100%',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  metricTitle: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    maxWidth: '80%',
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  value: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },

  unit: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});