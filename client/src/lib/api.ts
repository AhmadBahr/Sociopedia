import axios from 'axios';
import { API_URL } from './config';

export const api = axios.create({ baseURL: API_URL });

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as any;
  }
  return config;
});

