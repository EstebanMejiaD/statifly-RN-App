import { useEffect, useState } from 'react';

import { getToken } from '@/utils/token';

import { authService } from '@/api/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';


export function useAuthBootstrap() {
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getToken();
        if (!token) {
          return;
        }

        const user =
          await authService.getMe();


        useAuthStore.setState({
          token,
          user: user.data,
          isAuthenticated: true,
        });
      } catch (error) {
        console.log(
          'Error restoring session',
          error
        );

        useAuthStore.setState({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  return {
    loading,
  };
}