import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const owner = 1;

export const getBooks = () => api.get('/books');
export const addBook = (book) => api.post('/books/add', book, owner);
export const updateBook = (id, book) => api.put(`/books/${id}`, book);
export const deleteBook = (id) => api.delete(`/books/${id}`);
