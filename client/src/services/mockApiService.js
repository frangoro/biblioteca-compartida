// src/services/mockApiService.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Crear instancia del mock adapter
const mock = new MockAdapter(api, { delayResponse: 800 }); // Simula latencia de red

// Datos iniciales para mockear
let books = [
  { 
    id: 1, 
    title: 'Cien años de soledad', 
    author: 'Gabriel García Márquez', 
    category: 'Novela', 
    condition: 'Excelente', 
    owner: 'María',
    image: null 
  },
  { 
    id: 2, 
    title: 'El principito', 
    author: 'Antoine de Saint-Exupéry', 
    category: 'Ficción', 
    condition: 'Bueno', 
    owner: 'Juan',
    image: null 
  },
  { 
    id: 3, 
    title: 'Clean Code', 
    author: 'Robert C. Martin', 
    category: 'Programación', 
    condition: 'Como nuevo', 
    owner: 'Carlos',
    image: null 
  },
];

// Mock para GET /books
mock.onGet('/books').reply(() => {
  return [200, books];
});

// Mock para POST /books
mock.onPost('/books').reply((config) => {
  const book = JSON.parse(config.data);
  const newBook = {
    ...book,
    id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  
  books.push(newBook);
  return [201, newBook];
});

// Mock para PUT /books/:id
mock.onPut(/\/books\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const bookData = JSON.parse(config.data);
  
  const index = books.findIndex(book => book.id === id);
  if (index === -1) {
    return [404, { error: 'Libro no encontrado' }];
  }
  
  books[index] = { ...books[index], ...bookData };
  return [200, books[index]];
});

// Mock para DELETE /books/:id
mock.onDelete(/\/books\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  
  const index = books.findIndex(book => book.id === id);
  if (index === -1) {
    return [404, { error: 'Libro no encontrado' }];
  }
  
  const deletedBook = books[index];
  books = books.filter(book => book.id !== id);
  return [200, deletedBook];
});

// Exportar funciones de API
export const getBooks = () => api.get('/books');
export const addBook = (book) => api.post('/books', book);
export const updateBook = (id, book) => api.put(`/books/${id}`, book);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// Función para reiniciar los datos de prueba (útil para testing)
export const resetMockData = () => {
  books = [
    { 
      id: 1, 
      title: 'Cien años de soledad', 
      author: 'Gabriel García Márquez', 
      category: 'Novela', 
      condition: 'Excelente', 
      owner: 'María',
      image: null 
    },
    { 
      id: 2, 
      title: 'El principito', 
      author: 'Antoine de Saint-Exupéry', 
      category: 'Ficción', 
      condition: 'Bueno', 
      owner: 'Juan',
      image: null 
    },
    { 
      id: 3, 
      title: 'Clean Code', 
      author: 'Robert C. Martin', 
      category: 'Programación', 
      condition: 'Como nuevo', 
      owner: 'Carlos',
      image: null 
    },
  ];
};

export default api;