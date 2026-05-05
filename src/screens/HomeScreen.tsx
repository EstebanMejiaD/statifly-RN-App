import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBle } from '../hooks/useBle';
import { useAuthStore } from '../store/useAuthStore';
import { BleStatusBadge } from '../components/BleStatusBadge';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import type { RootStackParamList, BleDevice } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const { status, discoveredDevices, connectedDevice, scan, connect, disconnect } = useBle();

  const handleDevicePress = (device: BleDevice) => {
    if (connectedDevice?.id === device.id) {
      Alert.alert('Disconnect?', 'Do you want to disconnect from this device?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: disconnect },
      ]);
    } else {
      connect(device.id);
    }
  };

  const handleStartSession = () => {
    if (status !== 'connected') {
      Alert.alert('No device', 'Connect to a Statifly sensor first.');
      return;
    }
    navigation.navigate('LiveSession');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{user?.name ?? 'Athlete'} 👋</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={colors.textSecondary} />
        </View>
      </View>

      {/* BLE Status */}
      <BleStatusBadge status={status} />

      {/* Connect / Scan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={scan}
          activeOpacity={0.7}
          disabled={status === 'scanning'}
        >
          <Ionicons name="bluetooth" size={18} color={colors.bg} />
          <Text style={styles.scanText}>
            {status === 'scanning' ? 'Scanning...' : 'Scan for Devices'}
          </Text>
        </TouchableOpacity>

        {discoveredDevices.length > 0 && (
          <FlatList
            data={discoveredDevices}
            keyExtractor={(d) => d.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.deviceRow,
                  connectedDevice?.id === item.id && styles.deviceRowActive,
                ]}
                onPress={() => handleDevicePress(item)}
              >
                <Ionicons
                  name={connectedDevice?.id === item.id ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={connectedDevice?.id === item.id ? colors.primary : colors.textMuted}
                />
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name ?? 'Unknown'}</Text>
                  <Text style={styles.deviceId}>{item.id}</Text>
                </View>
                {item.rssi && (
                  <Text style={styles.rssi}>{item.rssi} dBm</Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Start Session */}
      <TouchableOpacity
        style={[styles.startButton, status !== 'connected' && styles.startButtonDisabled]}
        onPress={handleStartSession}
        activeOpacity={0.8}
      >
        <Ionicons name="play" size={22} color={colors.bg} />
        <Text style={styles.startText}>Start Session</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  scanText: {
    color: colors.bg,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  deviceRowActive: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  deviceName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  deviceId: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  rssi: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    marginTop: 'auto',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  startButtonDisabled: {
    backgroundColor: colors.bgCardLight,
  },
  startText: {
    color: colors.bg,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
