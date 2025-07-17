/**
 *  Intercerptor de Axios para añadir el token en las llamadas a la API
 */ 
import axios from 'axios';

// Create a custom Axios instance
const axiosInstance = axios.create({
  // URL de base para todas las peticiones a la API. Está configurada en el proxy en package.json
  // baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;