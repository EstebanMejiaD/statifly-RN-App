import axios from 'axios';
import { getToken, removeToken } from '../utils/token';
import { api } from './client';
import { authEvents } from './auth.events';

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      const isLoginRequest = error.config?.url?.includes('/users/login');
      if (status === 401 && !isLoginRequest) {
        console.log('Sesión expirada o token inválido');

        await removeToken();

        authEvents.emitUnauthorized();
      }
    }

    return Promise.reject(error);
  },
);