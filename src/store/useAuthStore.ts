import { create } from 'zustand';
import { User } from '../types/auth';
import { authService } from '../api/services/auth.service';
import { removeToken, saveToken } from '../utils/token';



interface AuthState {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    token: null,

    isAuthenticated: false,

    login: async (email, password) => {
      const response =
        await authService.login({
          email,
          password,
        });

      await saveToken(response.token);

      set({
        token: response.token,
        user: response.data,
        isAuthenticated: true,
      });
    },

    logout: async () => {
      await removeToken();

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    },
  }));