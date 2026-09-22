import type { HomeData } from '../types/home';

export const mockHomeData: HomeData = {
  fly: {
    connected: true,
    batteryLevel: 82,
    pendingSessions: 1,
    pendingSessionDurationMinutes: 84,
  },

  weeklyMetrics: [
    {
      id: 'training-load',
      title: 'CARGA DE ENTRENAMIENTO',
      value: null,
      subtitle: 'Sin datos suficientes',
      icon: 'trending-up',
    },
    {
      id: 'efficiency',
      title: 'EFICIENCIA',
      value: null,
      unit: '%',
      subtitle: 'Sin datos suficientes',
      icon: 'flash',
    },
    {
      id: 'weekly-volume',
      title: 'VOLUMEN SEMANAL',
      value: null,
      unit: 'h',
      subtitle: 'Sin sesiones registradas',
      icon: 'time-outline',
    },
  ],

  lastSession: null,

  recentSessions: [],
};