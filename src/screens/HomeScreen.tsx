import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useAuthStore } from '../store/useAuthStore';

import { HomeHeader } from '../components/home/HomeHeader';
import { FlySyncCard } from '../components/home/FlySyncCard';
import { WeeklyMetrics } from '../components/home/WeeklyMetrics';
import { LastSessionCard } from '../components/home/LastSessionCard';
import { SessionHistoryPreview } from '../components/home/SessionHistoryPreview';

import { mockHomeData } from '../mocks/home.mock';

import type {
  MainTabParamList,
} from '../types';

import type {
  HomeSessionSummary,
} from '../types/home';

import {
  colors,
  spacing,
} from '../utils/theme';

type Navigation =
  BottomTabNavigationProp<
    MainTabParamList,
    'Home'
  >;

export function HomeScreen() {
  const navigation =
    useNavigation<Navigation>();

  const user = useAuthStore(
    (state) => state.user,
  );

  /*
   * Temporalmente utilizamos el mock.
   *
   * Más adelante esto vendrá de:
   *
   * useHomeData()
   * ├── API
   * ├── useFlyStore()
   * └── session data
   */
  const home = mockHomeData;

  const handleImportSession = () => {
    /*
     * Próximo flujo:
     *
     * Fly
     * ↓
     * Descargar sesión BLE
     * ↓
     * Validar datos
     * ↓
     * Crear sesión
     */

    Alert.alert(
      'Sesión encontrada',
      'Por ahora estamos simulando la sesión disponible en Fly. El siguiente paso será construir el flujo de importación.',
      [
        {
          text: 'Entendido',
        },
      ],
    );
  };

  const handleSessionPress = (
    session: HomeSessionSummary,
  ) => {
    Alert.alert(
      session.name,
      'El detalle de sesión será implementado posteriormente.',
    );
  };

  const handleLastSessionPress = () => {
    if (!home.lastSession) {
      return;
    }

    handleSessionPress(
      home.lastSession,
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <HomeHeader
          name={user?.name ?? 'Atleta'}
          flyConnected={
            home.fly.connected
          }
          batteryLevel={
            home.fly.batteryLevel
          }
        />

        <FlySyncCard
          connected={
            home.fly.connected
          }
          pendingSessions={
            home.fly.pendingSessions
          }
          pendingSessionDurationMinutes={
            home.fly
              .pendingSessionDurationMinutes
          }
          onImportPress={
            handleImportSession
          }
        />

        <View style={styles.section}>
          <WeeklyMetrics
            metrics={
              home.weeklyMetrics
            }
          />
        </View>

        <View style={styles.section}>
          <LastSessionCard
            session={
              home.lastSession
            }
            onPress={
              handleLastSessionPress
            }
          />
        </View>

        <View style={styles.section}>
          <SessionHistoryPreview
            sessions={
              home.recentSessions
            }
            onViewAll={() =>
              navigation.navigate(
                'History',
              )
            }
            onSessionPress={
              handleSessionPress
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    scrollContent: {
      paddingHorizontal:
        spacing.lg,

      /*
       * Bottom tab tiene ~80px.
       * Dejamos suficiente espacio
       * para que ningún componente
       * quede oculto.
       */
      paddingBottom: 120,
    },

    section: {
      marginTop: spacing.xl,
    },
  });