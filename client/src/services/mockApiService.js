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

// Datos de ejemplo para desarrollo:
        const data = [
          {
            _id: '1',
            title: 'Cien años de soledad',
            author: 'Gabriel García Márquez',
            coverImageUrl: 'https://images.cdn1.buscalibre.com/fit-in/360x360/4c/b7/4cb75d1607ef3f2b604084f932822a1f.jpg',
            description: 'Una obra maestra de la literatura latinoamericana que narra la historia de la familia Buendía a lo largo de varias generaciones en el mítico pueblo de Macondo.'
          },
          {
            _id: '2',
            title: '1984',
            author: 'George Orwell',
            coverImageUrl: 'https://images.cdn1.buscalibre.com/fit-in/360x360/79/1b/791b5c4621c81ef417ee64ce744ce075.jpg',
            description: 'Una novela distópica que presenta un futuro donde un régimen totalitario controla cada aspecto de la vida.'
          },
          {
            _id: '3',
            title: 'El Principito',
            author: 'Antoine de Saint-Exupéry',
            coverImageUrl: 'https://images.cdn1.buscalibre.com/fit-in/360x360/c8/1f/c81f33f676f2f010f3c5f59c86431980.jpg',
            description: 'Una fábula poética y filosófica ilustrada que aborda temas como la soledad, la amistad, el amor y la pérdida.'
          },
          {
            _id: '4',
            title: 'Don Quijote de la Mancha',
            author: 'Miguel de Cervantes',
            coverImageUrl: 'https://images.cdn1.buscalibre.com/fit-in/360x360/4c/b7/4cb75d1607ef3f2b604084f932822a1f.jpg', // Usando una imagen similar para ejemplo
            description: 'La obra cumbre de la literatura española, un caballero que enloquece leyendo libros de caballerías y sale a buscar aventuras.'
          }
          // Añade más libros de ejemplo o carga desde tu API
        ];

export default api;