import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { RootStackParamList } from '@/types';
import { SFScreen } from '@/components/ui/SFScreen';
import { SFInput } from '@/components/ui/SFInput';
import { SFButton } from '@/components/ui/SFButton';
import { colors, fontSize, spacing } from '@/utils/theme';
import { authService } from '@/api/services/auth.service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';



type Props = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      await authService.login({
        email,
        password,
      });

      navigation.replace('MainTabs');
    } catch (error: any) {

      Alert.alert(
        'Ups no se pudo iniciar sesión',
        error?.message || 'Could not login'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SFScreen scroll>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Statifly</Text>

          <Text style={styles.subtitle}>
            Performance tracking for athletes
          </Text>
        </View>

        <View style={styles.form}>
          <SFInput
            label="Email"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <SFInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <SFButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SFScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  header: {
    marginTop: 80,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.hero,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.lg,
  },

  form: {
    marginTop: spacing.xxl,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },

  footerText: {
    color: colors.textSecondary,
  },

  registerText: {
    color: colors.primary,
    fontWeight: '700',
  },
});