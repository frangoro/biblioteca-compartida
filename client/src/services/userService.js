/**
 * Servicio para la gestión de usuarios.
 * 
 * Desde aquí se hacen las llamadas a la API.
 */

// Intercerptor de Axios para añadir el token en las llamadas a la API
import axiosInstance from './axiosInstance'; 

// Define la URL base de tu API para usuarios
// Asegúrate de que esta URL sea correcta para tu backend.
// Por ejemplo, si tu API está en http://localhost:5000/api/users,
// y tu frontend se sirve desde http://localhost:3000,
// entonces '/api/users' funcionará si tienes un proxy configurado en package.json
// o si accedes directamente al dominio del backend.
const API_URL = '/api/users'; 

// --- Funciones para interactuar con la API de Usuarios ---

/**
 * Obtiene todos los usuarios del sistema.
 * @returns {Promise<AxiosResponse<any>>} Promesa con la respuesta de la API.
 */
export const getAllUsers = async () => {
  // axiosInstance automáticamente añade el token si tienes un interceptor configurado
  // (como el que te mostré para la cabecera 'Authorization').
  return await axiosInstance.get(API_URL);
};

/**
 * Obtiene un usuario específico por su ID.
 * @param {string} id - El ID del usuario.
 * @returns {Promise<any>} Promesa con los datos del usuario.
 */
export const getUserById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  // Asumimos que los datos del usuario están directamente en response.data.
  // Si tu API los anida (ej. response.data.user), ajusta aquí.
  return response.data; 
};

/**
 * Crea un nuevo usuario.
 * @param {object} userData - Los datos del nuevo usuario (ej. { username, email, password, role }).
 * @returns {Promise<any>} Promesa con los datos del usuario creado.
 */
export const createUser = async (userData) => {
  const response = await axiosInstance.post(API_URL, userData);
  return response.data;
};

/**
 * Actualiza un usuario existente.
 * @param {string} id - El ID del usuario a actualizar.
 * @param {object} userData - Los datos a actualizar del usuario (ej. { username, email, role }).
 * @returns {Promise<any>} Promesa con los datos del usuario actualizado.
 */
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, userData);
  return response.data;
};

/**
 * Elimina un usuario por su ID.
 * @param {string} id - El ID del usuario a eliminar.
 * @returns {Promise<any>} Promesa con la confirmación de la eliminación.
 */
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`${API_URL}/${id}`);
  return response.data;
};

// --- Ejemplo de función de búsqueda (si tu backend tiene un endpoint específico para ello) ---
/**
 * Busca usuarios por un término dado.
 * Nota: Si tu getAllUsers ya soporta parámetros de búsqueda, podrías no necesitar esta.
 * @param {string} searchTerm - El término de búsqueda.
 * @returns {Promise<AxiosResponse<any>>} Promesa con la respuesta de la API.
 */
export const searchUsers = async (searchTerm) => {
  // Suponiendo que tu API acepta un parámetro 'q' para la búsqueda, e.g., /api/users?q=searchTerm
  return await axiosInstance.get(`${API_URL}?q=${encodeURIComponent(searchTerm)}`);
};