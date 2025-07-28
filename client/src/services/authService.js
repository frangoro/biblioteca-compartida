import axiosInstance from './axiosInstance'; 
const API_URL = '/api/auth'; 

// Función para el login de usuario
export const loginUserApi = async (credentials) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/login`, credentials);
        return response.data; // Debería devolver { user, token }
    } catch (error) {
        // Lanza el error para que el componente lo pueda capturar
        throw error.response.data || new Error('Error de red');
    }
};

// Función para el registro de usuario
export const registerUserApi = async (userData) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data || new Error('Error de red');
    }
};