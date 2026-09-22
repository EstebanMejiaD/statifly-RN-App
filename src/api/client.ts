import axios from 'axios';
import { API_URL } from '../utils/constants';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.log('========== API REQUEST ==========');
  console.log('URL:', `${config.baseURL}${config.url}`);
  console.log('METHOD:', config.method);
  console.log('PARAMS:', config.params);
  console.log('DATA:', config.data);
  console.log('================================');

  return config;
});