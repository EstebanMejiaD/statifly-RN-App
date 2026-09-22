import { useEffect, useState } from 'react';

import { getToken, removeToken } from '@/utils/token';
import { authService } from '@/api/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthBootstrap() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const token = await getToken();

        // No existe una sesión almacenada
        if (!token) {
          return;
        }

        // Validamos el token contra el backend
        const response = await authService.getMe();

        if (!mounted) {
          return;
        }

        useAuthStore.setState({
          token,
          user: response.data,
          isAuthenticated: true,
        });
      } catch (error) {
        console.log('Error restoring session:', error);

        // El token ya no es válido
        await removeToken();

        if (!mounted) {
          return;
        }

        useAuthStore.setState({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
  };
}