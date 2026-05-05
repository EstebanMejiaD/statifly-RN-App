import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useBle } from '../hooks/useBle';
import { useLiveMetrics } from '../hooks/useLiveMetrics';
import { useSessionStore } from '../store/useSessionStore';
import { useAuthStore } from '../store/useAuthStore';
import { MetricCard } from '../components/MetricCard';
import { formatDuration, msToKmh } from '../utils/helpers';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';
import { sessionStorage } from '../services/storage/sessionStorage';

const { width: SCREEN_W } = Dimensions.get('window');

export function LiveSessionScreen() {
  const navigation = useNavigation();
  const { liveBuffer, lastPoint, allPoints, disconnect } = useBle();
  const live = useLiveMetrics();
  const session = useSessionStore();
  const user = useAuthStore((s) => s.user);
  const mapRef = useRef<MapView>(null);
  const [elapsed, setElapsed] = useState(0);

  // Start session on mount
  useEffect(() => {
    session.startSession(user?.id ?? 'anon');
    return () => {
      // Cleanup if screen unmounts without stopping
    };
  }, []);

  // Timer
  useEffect(() => {
    if (session.status !== 'recording') return;
    const interval = setInterval(() => {
      if (session.currentSession) {
        setElapsed(Math.floor((Date.now() - session.currentSession.startedAt) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session.status]);

  // Center map on new position
  useEffect(() => {
    if (live.lat && live.lng && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: live.lat,
          longitude: live.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        300,
      );
    }
  }, [live.lat, live.lng]);

  const handleStop = async () => {
    if (session.currentSession) {
      const metrics = session.currentSession.metrics;
      session.stopSession({ ...metrics, duration: elapsed });

      // Save to local storage
      const completedSessions = useSessionStore.getState().sessions;
      if (completedSessions.length > 0) {
        await sessionStorage.saveSession(completedSessions[0]);
        if (allPoints.current.length > 0) {
          await sessionStorage.saveMetricPoints(
            completedSessions[0].id,
            allPoints.current,
          );
        }
      }
    }
    navigation.goBack();
  };

  const polylineCoords = liveBuffer.map((p) => ({
    latitude: p.lat,
    longitude: p.lng,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          customMapStyle={darkMapStyle}
          initialRegion={{
            latitude: live.lat || 40.4168,
            longitude: live.lng || -3.7038,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {live.lat !== 0 && (
            <Marker
              coordinate={{ latitude: live.lat, longitude: live.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.marker} />
            </Marker>
          )}
          {polylineCoords.length > 1 && (
            <Polyline
              coordinates={polylineCoords}
              strokeColor={colors.primary}
              strokeWidth={3}
            />
          )}
        </MapView>

        {/* Overlay: Timer */}
        <View style={styles.timerOverlay}>
          <Text style={styles.timerText}>{formatDuration(elapsed)}</Text>
          <View style={styles.recordingDot} />
        </View>
      </View>

      {/* Metrics Panel */}
      <View style={styles.panel}>
        <View style={styles.metricsRow}>
          <MetricCard label="Speed" value={live.speedKmh} unit="km/h" />
          <MetricCard
            label="Acceleration"
            value={live.acceleration.toFixed(1)}
            unit="m/s²"
            color={live.acceleration >= 0 ? colors.primary : colors.error}
          />
        </View>
        <View style={styles.metricsRow}>
          <MetricCard
            label="Distance"
            value={((session.currentSession?.metrics.distance ?? 0) / 1000).toFixed(2)}
            unit="km"
          />
          <MetricCard
            label="Max Speed"
            value={msToKmh(session.currentSession?.metrics.maxSpeed ?? 0).toFixed(1)}
            unit="km/h"
          />
        </View>

        {/* Stop Button */}
        <TouchableOpacity style={styles.stopButton} onPress={handleStop} activeOpacity={0.8}>
          <Ionicons name="stop" size={24} color={colors.bg} />
          <Text style={styles.stopText}>Stop Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Minimal dark map style for Google Maps
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.bg,
  },
  timerOverlay: {
    position: 'absolute',
    top: spacing.md,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  timerText: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    marginLeft: spacing.sm,
  },
  panel: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  stopText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
