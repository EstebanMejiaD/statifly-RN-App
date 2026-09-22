import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  spacing,
  fontSize,
  borderRadius,
} from '../../utils/theme';

interface FlySyncCardProps {
  connected: boolean;
  pendingSessions: number;
  pendingSessionDurationMinutes: number | null;
  onImportPress: () => void;
}

export function FlySyncCard({
  connected,
  pendingSessions,
  pendingSessionDurationMinutes,
  onImportPress,
}: FlySyncCardProps) {
  const hasPendingSession =
    connected && pendingSessions > 0;

  if (!hasPendingSession) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name={connected ? 'checkmark' : 'bluetooth-outline'}
            size={26}
            color={
              connected
                ? colors.primary
                : colors.textSecondary
            }
          />
        </View>

        <Text style={styles.emptyTitle}>
          {connected
            ? 'Fly está actualizado'
            : 'Fly no está conectado'}
        </Text>

        <Text style={styles.emptyDescription}>
          {connected
            ? 'No encontramos sesiones pendientes por sincronizar.'
            : 'Enciende tu Fly después de una actividad para sincronizar tus datos.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.glow} />

      <View style={styles.pendingRow}>
        <View style={styles.liveDot} />

        <Text style={styles.pendingLabel}>
          SINCRONIZACIÓN PENDIENTE
        </Text>
      </View>

      <Text style={styles.title}>
        {pendingSessions === 1
          ? '1 sesión disponible desde Fly'
          : `${pendingSessions} sesiones disponibles desde Fly`}
      </Text>

      <Text style={styles.description}>
        {pendingSessionDurationMinutes
          ? `Tu Fly registró ${pendingSessionDurationMinutes} minutos de actividad. Los datos están listos para ser importados.`
          : 'Tu Fly tiene nuevos datos listos para ser importados.'}
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onImportPress}
      >
        <Ionicons
          name="sync"
          size={19}
          color={colors.bg}
        />

        <Text style={styles.buttonText}>
          IMPORTAR SESIÓN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    overflow: 'hidden',
  },

  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primaryMuted,
    top: -120,
    right: -80,
  },

  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,

    shadowColor: colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  pendingLabel: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.4,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    lineHeight: 34,
    maxWidth: 300,
  },

  description: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 21,
    marginTop: spacing.md,
  },

  button: {
    marginTop: spacing.lg,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,

    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  buttonText: {
    color: colors.bg,
    fontSize: fontSize.sm,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  emptyCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgCardLight,
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
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
    maxWidth: 290,
  },
});