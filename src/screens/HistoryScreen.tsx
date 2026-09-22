import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/useAuthStore';

import { sportsService } from '@/api/services/sports.service';
import { sessionsService } from '@/api/services/sessions.service';



import {
  colors,
  spacing,
  borderRadius,
  fontSize,
} from '@/utils/theme';
import type{ Sport } from '@/types/sport';
import type { Session } from '@/types/session';

export function HistoryScreen() {
  const insets = useSafeAreaInsets();

  const user = useAuthStore((state) => state.user);

  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportId, setSelectedSportId] =
    useState<string | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);

  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [sportsError, setSportsError] =
    useState<string | null>(null);

  const [sessionsError, setSessionsError] =
    useState<string | null>(null);

  const [sportSelectorOpen, setSportSelectorOpen] =
    useState(false);

  /*
   * ============================================================
   * DEPORTES
   * ============================================================
   */

  const loadSports = useCallback(async () => {
    try {
      setSportsError(null);
      setLoadingSports(true);

      const response = await sportsService.getAll();

      const availableSports = response.data ?? [];

      setSports(availableSports);

      /*
       * Seleccionamos el primer deporte automáticamente.
       *
       * No sobrescribimos la selección si el usuario
       * ya había seleccionado uno.
       */
      setSelectedSportId((current) => {
        if (
          current &&
          availableSports.some((sport) => sport.id === current)
        ) {
          return current;
        }

        return availableSports[0]?.id ?? null;
      });
    } catch (error) {
      console.error('Error loading sports:', error);

      setSportsError(
        'No pudimos cargar los deportes disponibles.',
      );
    } finally {
      setLoadingSports(false);
    }
  }, []);

  /*
   * ============================================================
   * SESIONES
   * ============================================================
   */

  const loadSessions = useCallback(async () => {
    if (!user?.id || !selectedSportId) {
      setSessions([]);
      return;
    }

    try {
      setSessionsError(null);
      setLoadingSessions(true);

      console.log('Loading sessions:', {
        userId: user.id,
        sportId: selectedSportId,
      });

      const response = await sessionsService.getAll({
        userId: user.id,
        sportId: selectedSportId,
      });

      setSessions(response.data ?? []);
    } catch (error) {
      console.error('Error loading sessions:', error);

      setSessionsError(
        'No pudimos cargar las sesiones de este deporte.',
      );

      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [user?.id, selectedSportId]);

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {
    loadSports();
  }, [loadSports]);

  /*
   * Cuando selectedSportId cambia:
   *
   * Fútbol → GET /sessions
   *
   * {
   *   userId,
   *   sportId
   * }
   */
  useEffect(() => {
    if (!selectedSportId) {
      return;
    }

    loadSessions();
  }, [selectedSportId, loadSessions]);

  /*
   * ============================================================
   * REFRESH
   * ============================================================
   */

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      /*
       * Volvemos a obtener deportes.
       *
       * loadSports conserva el deporte seleccionado
       * si todavía existe.
       */
      await loadSports();

      /*
       * Si el deporte seleccionado no cambió,
       * cargamos nuevamente sus sesiones.
       */
      await loadSessions();
    } finally {
      setRefreshing(false);
    }
  };

  /*
   * ============================================================
   * SPORT SELECTION
   * ============================================================
   */

  const selectedSport = useMemo(() => {
    return sports.find(
      (sport) => sport.id === selectedSportId,
    );
  }, [sports, selectedSportId]);

  const handleSelectSport = (sportId: string) => {
    setSportSelectorOpen(false);

    if (sportId === selectedSportId) {
      return;
    }

    setSelectedSportId(sportId);
  };

  /*
   * ============================================================
   * TOTAL DISTANCE
   * ============================================================
   */

  const totalDistance = useMemo(() => {
    return sessions.reduce(
      (total, session) => total + (session.distance ?? 0),
      0,
    );
  }, [sessions]);

  /*
   * ============================================================
   * LOADING SPORTS
   * ============================================================
   */

  if (loadingSports) {
    return (
      <View
        style={[
          styles.center,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Cargando deportes...
        </Text>
      </View>
    );
  }

  /*
   * ============================================================
   * SPORTS ERROR
   * ============================================================
   */

  if (sportsError) {
    return (
      <View
        style={[
          styles.center,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={42}
          color={colors.textMuted}
        />

        <Text style={styles.errorText}>
          {sportsError}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadSports}
        >
          <Text style={styles.retryButtonText}>
            Reintentar
          </Text>
        </Pressable>
      </View>
    );
  }

  /*
   * ============================================================
   * NO SPORTS
   * ============================================================
   */

  if (sports.length === 0) {
    return (
      <View
        style={[
          styles.center,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <Ionicons
          name="fitness-outline"
          size={48}
          color={colors.textMuted}
        />

        <Text style={styles.emptyTitle}>
          No hay deportes disponibles
        </Text>

        <Text style={styles.emptyText}>
          No encontramos deportes configurados para
          consultar tu historial.
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadSports}
        >
          <Text style={styles.retryButtonText}>
            Actualizar
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: spacing.xxl,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() ?? 'S'}
              </Text>
            </View>

            <View>
              <Text style={styles.brand}>
                STATIFLY
              </Text>

              <View style={styles.connectionRow}>
                <View style={styles.connectionDot} />

                <Text style={styles.connectionText}>
                  CONEXIÓN DEL SENSOR ACTIVA
                </Text>
              </View>
            </View>
          </View>

          <Ionicons
            name="bluetooth"
            size={22}
            color={colors.primary}
          />
        </View>

        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <View style={styles.titleSection}>
          <Text style={styles.title}>
            HISTORIAL DE TELEMETRÍA
          </Text>

          <Text style={styles.subtitle}>
            FLUJO DE DATOS DEL SENSOR
          </Text>
        </View>

        {/* ================================================== */}
        {/* TOTAL PROCESADO */}
        {/* ================================================== */}

        <View style={styles.totalSection}>
          <Text style={styles.totalValue}>
            {totalDistance.toFixed(1)} KM
          </Text>

          <Text style={styles.totalLabel}>
            TOTAL PROCESADO
          </Text>
        </View>

        {/* ================================================== */}
        {/* FILTER HEADER */}
        {/* ================================================== */}

        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>
            FILTROS
          </Text>

          <Pressable
            onPress={() => {
              if (sports.length > 0) {
                setSelectedSportId(sports[0].id);
              }

              setSportSelectorOpen(false);
            }}
          >
            <Text style={styles.resetText}>
              Restablecer
            </Text>
          </Pressable>
        </View>

        {/* ================================================== */}
        {/* SPORT SELECTOR */}
        {/* ================================================== */}

        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>
            DEPORTE
          </Text>

          <Pressable
            style={styles.sportSelector}
            onPress={() =>
              setSportSelectorOpen((current) => !current)
            }
          >
            <View style={styles.sportSelectorLeft}>
              {/* <View style={styles.sportIcon}>
                <Ionicons
                  name="football-outline"
                  size={18}
                  color={colors.primary}
                />
              </View> */}

              <Text style={styles.selectedSportText}>
                {selectedSport?.name ?? 'Seleccionar deporte'}
              </Text>
            </View>

            <Ionicons
              name={
                sportSelectorOpen
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>

          {sportSelectorOpen && (
            <View style={styles.sportOptions}>
              {sports.map((sport) => {
                const selected =
                  sport.id === selectedSportId;

                return (
                  <Pressable
                    key={sport.id}
                    style={[
                      styles.sportOption,
                      selected &&
                        styles.sportOptionSelected,
                    ]}
                    onPress={() =>
                      handleSelectSport(sport.id)
                    }
                  >
                    <View
                      style={styles.sportOptionLeft}
                    >
                      {/* <Ionicons
                        name="football-outline"
                        size={18}
                        color={
                          selected
                            ? colors.primary
                            : colors.textSecondary
                        }
                      /> */}

                      <Text
                        style={[
                          styles.sportOptionText,
                          selected &&
                            styles.sportOptionTextSelected,
                        ]}
                      >
                        {sport.name}
                      </Text>
                    </View>

                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* ================================================== */}
        {/* OTHER FILTERS */}
        {/* ================================================== */}

        <View style={styles.secondaryFilters}>
          <View style={styles.filterChip}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.textSecondary}
            />

            <Text style={styles.filterChipText}>
              Rango de fechas
            </Text>

            <Ionicons
              name="chevron-down"
              size={15}
              color={colors.textMuted}
            />
          </View>

          <View
            style={[
              styles.filterChip,
              styles.filterChipDisabled,
            ]}
          >
            <Ionicons
              name="radio-outline"
              size={16}
              color={colors.textMuted}
            />

            <Text style={styles.filterChipDisabledText}>
              Calidad de señal
            </Text>
          </View>
        </View>

        {/* ================================================== */}
        {/* PENDING */}
        {/* ================================================== */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.pendingDot} />

              <Text style={styles.sectionTitle}>
                PENDIENTE DE SINCRONIZACIÓN
              </Text>
            </View>
          </View>

          <View style={styles.pendingEmptyCard}>
            <Ionicons
              name="cloud-done-outline"
              size={28}
              color={colors.textMuted}
            />

            <Text style={styles.pendingEmptyTitle}>
              Sin sesiones pendientes
            </Text>

            <Text style={styles.pendingEmptyText}>
              Las sesiones descargadas desde tu sensor
              aparecerán aquí antes de sincronizarse.
            </Text>
          </View>
        </View>

        {/* ================================================== */}
        {/* PROCESSED */}
        {/* ================================================== */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              PROCESADAS
            </Text>

            <Text style={styles.sessionCount}>
              {sessions.length}
            </Text>
          </View>

          {loadingSessions ? (
            <View style={styles.sessionsLoading}>
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />

              <Text style={styles.loadingSessionsText}>
                Cargando sesiones...
              </Text>
            </View>
          ) : sessionsError ? (
            <View style={styles.errorCard}>
              <Ionicons
                name="alert-circle-outline"
                size={24}
                color={colors.error}
              />

              <Text style={styles.errorCardText}>
                {sessionsError}
              </Text>

              <Pressable
                onPress={loadSessions}
                style={styles.smallRetry}
              >
                <Text style={styles.smallRetryText}>
                  Reintentar
                </Text>
              </Pressable>
            </View>
          ) : sessions.length === 0 ? (
            <View style={styles.emptySessions}>
              <Ionicons
                name="analytics-outline"
                size={40}
                color={colors.textMuted}
              />

              <Text style={styles.emptyTitle}>
                No hay sesiones
              </Text>

              <Text style={styles.emptyText}>
                Todavía no tienes sesiones registradas
                para {selectedSport?.name ?? 'este deporte'}.
              </Text>
            </View>
          ) : (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/*
 * ============================================================
 * SESSION CARD
 * ============================================================
 */

interface SessionCardProps {
  session: Session;
}

function SessionCard({
  session,
}: SessionCardProps) {
  const date = formatSessionDate(session.startTime);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.sessionCard,
        pressed && styles.sessionCardPressed,
      ]}
    >
      {/* Telemetry preview */}

      <View style={styles.telemetryPreview}>
        <View style={styles.telemetryGrid} />

        <View
          style={[
            styles.heatPoint,
            styles.heatPointOne,
          ]}
        />

        <View
          style={[
            styles.heatPoint,
            styles.heatPointTwo,
          ]}
        />

        <View
          style={[
            styles.heatPoint,
            styles.heatPointThree,
          ]}
        />

        <View style={styles.routeLineOne} />
        <View style={styles.routeLineTwo} />

        <View style={styles.previewOverlay}>
          <Ionicons
            name="analytics-outline"
            size={20}
            color={colors.primary}
          />
        </View>
      </View>

      {/* Card content */}

      <View style={styles.sessionContent}>
        <View style={styles.sessionTopRow}>
          <View style={styles.finalizedBadge}>
            <View style={styles.finalizedDot} />

            <Text style={styles.finalizedText}>
              FINALIZADA
            </Text>
          </View>

          <Text style={styles.sessionDate}>
            {date}
          </Text>
        </View>

        <Text
          style={styles.sessionName}
          numberOfLines={2}
        >
          {session.name}
        </Text>

        {session.description ? (
          <Text
            style={styles.sessionDescription}
            numberOfLines={2}
          >
            {session.description}
          </Text>
        ) : null}

        <View style={styles.metricsRow}>
          <SessionMetric
            label="DURACIÓN"
            value={formatDuration(session.duration)}
          />

          <SessionMetric
            label="DISTANCIA"
            value={formatDistance(session.distance)}
          />

          <SessionMetric
            label="VEL. MÁX."
            value={formatSpeed(session.maxSpeed)}
          />
        </View>
      </View>
    </Pressable>
  );
}

/*
 * ============================================================
 * SESSION METRIC
 * ============================================================
 */

interface SessionMetricProps {
  label: string;
  value: string;
}

function SessionMetric({
  label,
  value,
}: SessionMetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <Text style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

/*
 * ============================================================
 * FORMATTERS
 * ============================================================
 */

function formatDuration(
  seconds?: number | null,
): string {
  if (
    seconds === undefined ||
    seconds === null ||
    seconds < 0
  ) {
    return '--:--';
  }

  const totalSeconds = Math.floor(seconds);

  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const remainingSeconds =
    totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(
      minutes,
    ).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(
    2,
    '0',
  )}:${String(remainingSeconds).padStart(
    2,
    '0',
  )}`;
}

function formatDistance(
  distance?: number | null,
): string {
  if (
    distance === undefined ||
    distance === null
  ) {
    return '--';
  }

  return `${distance.toFixed(2)} km`;
}

function formatSpeed(
  speed?: number | null,
): string {
  if (
    speed === undefined ||
    speed === null
  ) {
    return '--';
  }

  return `${speed.toFixed(1)} km/h`;
}

function formatSessionDate(
  dateString: string,
): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleDateString(
    'es-CO',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
}

/*
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingHorizontal: spacing.md,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
  },

  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },

  errorText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },

  retryButtonText: {
    color: colors.bg,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  emptyTitle: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
  },

  /*
   * HEADER
   */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bgCardLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  avatarText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '800',
  },

  brand: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  connectionText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /*
   * TITLE
   */

  titleSection: {
    marginBottom: spacing.lg,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: spacing.xs,
  },

  /*
   * TOTAL
   */

  totalSection: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },

  totalValue: {
    color: colors.primary,
    fontSize: fontSize.hero,
    fontWeight: '800',
    letterSpacing: -1,
  },

  totalLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: spacing.xs,
  },

  /*
   * FILTERS
   */

  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  filterTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  resetText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },

  filterCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },

  filterLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },

  sportSelector: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },

  sportSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sportIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  selectedSportText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  sportOptions: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },

  sportOption: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },

  sportOptionSelected: {
    backgroundColor: colors.primaryMuted,
  },

  sportOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sportOptionText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
  },

  sportOptionTextSelected: {
    color: colors.textPrimary,
    fontWeight: '700',
  },

  secondaryFilters: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },

  filterChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },

  filterChipDisabled: {
    opacity: 0.55,
  },

  filterChipDisabledText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },

  /*
   * SECTIONS
   */

  section: {
    marginBottom: spacing.xl,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
    marginRight: spacing.xs,
  },

  sessionCount: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  /*
   * PENDING
   */

  pendingEmptyCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },

  pendingEmptyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginTop: spacing.sm,
  },

  pendingEmptyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  /*
   * SESSION STATES
   */

  sessionsLoading: {
    minHeight: 120,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  loadingSessionsText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },

  errorCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },

  errorCardText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  smallRetry: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.sm,
  },

  smallRetryText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  emptySessions: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },

  /*
   * SESSION CARD
   */

  sessionCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },

  sessionCardPressed: {
    opacity: 0.8,
  },

  telemetryPreview: {
    height: 130,
    backgroundColor: colors.bgCardLight,
    overflow: 'hidden',
    position: 'relative',
  },

  telemetryGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.12,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  heatPoint: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: colors.primaryMuted,
  },

  heatPointOne: {
    left: '15%',
    top: '25%',
  },

  heatPointTwo: {
    left: '48%',
    top: '10%',
    width: 75,
    height: 75,
    borderRadius: 38,
  },

  heatPointThree: {
    right: '10%',
    bottom: '5%',
    width: 65,
    height: 65,
    borderRadius: 33,
  },

  routeLineOne: {
    position: 'absolute',
    width: '70%',
    height: 2,
    backgroundColor: colors.primary,
    left: '15%',
    top: '48%',
    transform: [
      {
        rotate: '-12deg',
      },
    ],
    opacity: 0.65,
  },

  routeLineTwo: {
    position: 'absolute',
    width: '45%',
    height: 2,
    backgroundColor: colors.primary,
    left: '38%',
    top: '58%',
    transform: [
      {
        rotate: '25deg',
      },
    ],
    opacity: 0.4,
  },

  previewOverlay: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sessionContent: {
    padding: spacing.md,
  },

  sessionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  finalizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  finalizedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  finalizedText: {
    color: colors.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  sessionDate: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },

  sessionName: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '800',
    marginTop: spacing.sm,
    lineHeight: 22,
  },

  sessionDescription: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 18,
    marginTop: spacing.xs,
  },

  metricsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },

  metric: {
    flex: 1,
  },

  metricLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  metricValue: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginTop: 3,
  },
});