import axios from 'axios';

// Environment variable config fallback (defaults to http://localhost:8000/api)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request Interceptor: Attach JWT Token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aid_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Friendly Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.detail || error.response?.data?.message || 'Network error or server unreachable.',
      status: error.response?.status || 500
    };
    return Promise.reject(customError);
  }
);

// Backward-compatibility export for legacy & clinical assessment pages
export const runAIDiagnosticAPI = async (payload: any) => {
  try {
    const response = await apiClient.post('/v1/diagnostic/assess', payload);
    return response.data?.data || response.data;
  } catch (e1) {
    try {
      const response = await apiClient.post('/assessments/asm-temp/analyze', payload);
      return response.data?.data || response.data;
    } catch (e2) {
      console.warn('Backend API endpoint unreachable or error returned, using diagnostic fallback:', e2);
      return null;
    }
  }
};
