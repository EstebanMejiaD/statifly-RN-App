export const endpoints = {
  auth: {
    login: '/users/login',
    register: '/users/register',
  },

  users: {
    all: '/users',
    byId: (id: string) => `/users/${id}`,
  },

  sports: {
    all: '/sports',
    byId: (id: string) => `/sports/${id}`,
  },

  playgrounds: {
    all: '/playgrounds',
    byId: (id: string) => `/playgrounds/${id}`,
  },

  sessions: {
    all: '/sessions',
    byId: (id: string) => `/sessions/${id}`,
  },

  metricPoints: {
    all: '/metric-points',
    byId: (id: string) => `/metric-points/${id}`,
    bulk: (sessionId: string) =>
      `/metric-points/${sessionId}/bulk`,
  },
};