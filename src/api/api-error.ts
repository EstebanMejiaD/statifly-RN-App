import axios from 'axios';

export function getApiErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (
      data &&
      typeof data === 'object' &&
      'message' in data
    ) {
      const message = data.message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(', ');
      }
    }

    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado.';
    }

    if (!error.response) {
      return 'No se pudo conectar con el servidor.';
    }
  }

  return 'Ocurrió un error inesperado.';
}