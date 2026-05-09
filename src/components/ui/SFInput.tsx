import { borderRadius, colors, fontSize, spacing } from '@/utils/theme';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';


interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function SFInput({ label, error, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, error && styles.inputError]}
        {...props}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },

  label: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontSize: fontSize.md,
  },

  input: {
    backgroundColor: colors.bgInput,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    fontSize: fontSize.lg,
  },

  inputError: {
    borderColor: colors.error,
  },

  error: {
    marginTop: spacing.sm,
    color: colors.error,
    fontSize: fontSize.sm,
  },
});