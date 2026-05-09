import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types';

import { SFScreen } from '@/components/ui/SFScreen';
import { SFInput } from '@/components/ui/SFInput';
import { SFButton } from '@/components/ui/SFButton';

import {
  borderRadius,
  colors,
  fontSize,
  spacing,
} from '@/utils/theme';

import { authService } from '@/api/services/auth.service';
import { CompetitiveLevel, DominantFoot, Gender } from '@/types/auth';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;





export function RegisterScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');

  const [birthDate, setBirthDate] = useState('');

  const [gender, setGender] =
    useState<Gender>('MALE');

  const [dominantFoot, setDominantFoot] =
    useState<DominantFoot>('RIGHT');

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [competitiveLevel, setCompetitiveLevel] =
    useState<CompetitiveLevel>('INTERMEDIATE');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');

  async function handleRegister() {
    try {
      setLoading(true);

      if (
        !name ||
        !lastName ||
        !email ||
        !password
      ) {
        Alert.alert(
          'Campos requeridos',
          'Completa todos los campos obligatorios'
        );

        return;
      }

      await authService.register({
        name,
        lastName,
        birthDate: new Date(birthDate).toISOString(),

        gender,
        dominantFoot,

        height: Number(height),
        weight: Number(weight),

        competitiveLevel,

        email,
        phone,

        password,
      });

      Alert.alert(
        'Registro exitoso',
        'Tu cuenta fue creada correctamente'
      );

      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'No se pudo registrar'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SFScreen scroll>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Crear Cuenta
          </Text>

          <Text style={styles.subtitle}>
            Empieza a medir tu rendimiento
          </Text>
        </View>

        <View style={styles.form}>
          <SFInput
            label="Nombre"
            placeholder="Esteban"
            value={name}
            onChangeText={setName}
          />

          <SFInput
            label="Apellido"
            placeholder="Mejia"
            value={lastName}
            onChangeText={setLastName}
          />

          <SFInput
            label="Fecha de nacimiento"
            placeholder="2002-08-10"
            value={birthDate}
            onChangeText={setBirthDate}
          />

          <Text style={styles.label}>Género</Text>

          <View style={styles.row}>
            <OptionButton
              label="Masculino"
              selected={gender === 'MALE'}
              onPress={() => setGender('MALE')}
            />

            <OptionButton
              label="Femenino"
              selected={gender === 'FEMALE'}
              onPress={() => setGender('FEMALE')}
            />
          </View>

          <Text style={styles.label}>
            Pierna dominante
          </Text>

          <View style={styles.row}>
            <OptionButton
              label="Derecha"
              selected={dominantFoot === 'RIGHT'}
              onPress={() =>
                setDominantFoot('RIGHT')
              }
            />

            <OptionButton
              label="Izquierda"
              selected={dominantFoot === 'LEFT'}
              onPress={() =>
                setDominantFoot('LEFT')
              }
            />

            <OptionButton
              label="Ambas"
              selected={dominantFoot === 'BOTH'}
              onPress={() =>
                setDominantFoot('BOTH')
              }
            />
          </View>

          <SFInput
            label="Altura (cm)"
            placeholder="177"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />

          <SFInput
            label="Peso (kg)"
            placeholder="60"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={styles.label}>
            Nivel competitivo
          </Text>

          <View style={styles.levels}>
            <OptionButton
              label="Principiante"
              selected={
                competitiveLevel === 'BEGINNER'
              }
              onPress={() =>
                setCompetitiveLevel('BEGINNER')
              }
            />

            <OptionButton
              label="Intermedio"
              selected={
                competitiveLevel ===
                'INTERMEDIATE'
              }
              onPress={() =>
                setCompetitiveLevel(
                  'INTERMEDIATE'
                )
              }
            />

            <OptionButton
              label="Avanzado"
              selected={
                competitiveLevel === 'SEMIPROFESSIONAL'
              }
              onPress={() =>
                setCompetitiveLevel('SEMIPROFESSIONAL')
              }
            />

            <OptionButton
              label="Profesional"
              selected={
                competitiveLevel ===
                'PROFESSIONAL'
              }
              onPress={() =>
                setCompetitiveLevel(
                  'PROFESSIONAL'
                )
              }
            />
          </View>

          <SFInput
            label="Correo"
            placeholder="correo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <SFInput
            label="Teléfono"
            placeholder="3001234567"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <SFInput
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <SFButton
            title="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.loginText}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SFScreen>
  );
}

type OptionButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function OptionButton({
  label,
  selected,
  onPress,
}: OptionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionButton,
        selected && styles.optionButtonActive,
      ]}
    >
      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },

  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
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
    gap: spacing.lg,
  },

  label: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  levels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  optionButton: {
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },

  optionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  optionText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },

  optionTextActive: {
    color: '#000',
  },

  footer: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  footerText: {
    color: colors.textSecondary,
  },

  loginText: {
    color: colors.primary,
    fontWeight: '700',
  },
});