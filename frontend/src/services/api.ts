import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Connect back to our local Spring Boot REST API
const API_BASE_URL = 'http://192.168.1.9:8080/api'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Bearer Token on protected request chains
apiClient.interceptors.request.use(
  (config: any) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default apiClient;

