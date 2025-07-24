import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ajusta según tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data?.message || 'Error desconocido');
  }
);

export default api;