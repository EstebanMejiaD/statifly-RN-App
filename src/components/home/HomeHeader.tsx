import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  spacing,
  fontSize,
  borderRadius,
} from '../../utils/theme';

interface HomeHeaderProps {
  name: string;
  flyConnected: boolean;
  batteryLevel: number | null;
}

export function HomeHeader({
  name,
  flyConnected,
  batteryLevel,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={20}
            color={colors.textSecondary}
          />
        </View>

        <View style={styles.userText}>
          <Text style={styles.greeting}>
            BUENOS DÍAS
          </Text>

          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.logo}>
          STATIFLY
        </Text>

        <View
          style={[
            styles.flyStatus,
            flyConnected && styles.flyStatusConnected,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: flyConnected
                  ? colors.primary
                  : colors.textMuted,
              },
            ]}
          />

          <Text
            style={[
              styles.flyText,
              flyConnected && styles.flyTextConnected,
            ]}
          >
            {flyConnected
              ? `FLY${batteryLevel !== null ? ` · ${batteryLevel}%` : ''}`
              : 'FLY OFF'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userText: {
    marginLeft: spacing.sm,
    flexShrink: 1,
  },

  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 1.2,
  },

  name: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: 2,
  },

  rightContainer: {
    alignItems: 'flex-end',
  },

  logo: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  flyStatus: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },

  flyStatusConnected: {
    backgroundColor: colors.primaryMuted,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  flyText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  flyTextConnected: {
    color: colors.primary,
  },
});