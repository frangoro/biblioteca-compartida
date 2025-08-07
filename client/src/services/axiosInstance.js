/**
 *  Interceptor de Axios para añadir el token en las llamadas a la API
 *  Se ejecuta antes de cada petición HTTP y después de cada respuesta.
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

// Variable para almacenar la función de logout
let onLogoutCallback = () => {};

// Función para establecer el callback de logout
export const setLogoutCallback = (callback) => {
  onLogoutCallback = callback;
};

// Interceptor de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la respuesta es un error 401 (No Autorizado)
    if (error.response?.status === 401) {
      console.log('Se detectó un 401. Llamando a la función de logout...');
      // Llama a la función de logout almacenada
      onLogoutCallback();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;