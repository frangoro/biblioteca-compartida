import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const owner = 1;

/* Gestión de libros */
export const getBooks = () => api.get('/books');
export const getBooksQuery = (queryParams) => api.get(`/books?${queryParams}`);
export const addBook = (book) => api.post('/books/add', book, owner);
export const updateBook = (id, book) => api.put(`/books/update/${id}`, book);
export const deleteBook = (id) => api.delete(`/books/delete/${id}`);
export const readBook = (id) => api.get(`/books/${id}`);

/* Gestión de Usuarios */
//TODO: realizar estas funciones en el servidor
export const getAllUsers = () => api.get('/users');
export const searchUsers = (id) => api.get(`/users/${id}`);
export const deleteUser = (id) => api.get(`/users/${id}`);

// Función para el login de usuario
export const loginUserApi = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data; // Debería devolver { user, token }
    } catch (error) {
        // Lanza el error para que el componente lo pueda capturar
        throw error.response.data || new Error('Error de red');
    }
};

// Función para el registro de usuario
export const registerUserApi = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        throw error.response.data || new Error('Error de red');
    }
};

// Configurar un interceptor para todas las solicitudes de Axios
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // O el nombre que uses para tu token
    console.log(token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);