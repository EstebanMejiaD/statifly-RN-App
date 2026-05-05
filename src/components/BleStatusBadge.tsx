import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, fontSize } from '../utils/theme';
import type { BleConnectionStatus } from '../types';

const statusConfig: Record<BleConnectionStatus, { color: string; label: string }> = {
  disconnected: { color: colors.textMuted, label: 'Disconnected' },
  scanning: { color: colors.warning, label: 'Scanning...' },
  connecting: { color: colors.warning, label: 'Connecting...' },
  connected: { color: colors.primary, label: 'Connected' },
  reconnecting: { color: colors.warning, label: 'Reconnecting...' },
  error: { color: colors.error, label: 'Error' },
};

export function BleStatusBadge({ status }: { status: BleConnectionStatus }) {
  const config = statusConfig[status];
  return (
    <View style={[styles.badge, { borderColor: config.color }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
