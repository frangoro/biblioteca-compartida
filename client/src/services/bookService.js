/**
 * Gestión de libros
 */

import axiosInstance from './axiosInstance'; 

//TODO: Tomar el id del usuario logado
const owner = 1;
const API_URL = '/api/books'; 

export const getBooks = () => axiosInstance.get(API_URL);
export const getBooksQuery = (params) => axiosInstance.get(API_URL, { params });
export const addBook = (book) => axiosInstance.post(`${API_URL}/add`, book, owner);
export const updateBook = (id, book) => axiosInstance.put(`${API_URL}/update/${id}`, book);
export const deleteBook = (id) => axiosInstance.delete(`${API_URL}/delete/${id}`);
export const readBook = (id) => axiosInstance.get(`${API_URL}/${id}`);

