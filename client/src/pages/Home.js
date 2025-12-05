/* Página principal que muestra la lista de libros de todos los usuarios */

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { getBooksWithSearchAndPagination } from '../services/bookService';
import styles from "./Home.module.css";
const LIMIT = 50; // Constante de libros por página

function Home() {
  
  // Estado para los libros y carga
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para la Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Estado para la Búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title'); // Por defecto 'title'
  // Estado auxiliar para saber si estamos en la carga inicial (para ordenar por createdAt)
  const [isInitialLoad, setIsInitialLoad] = useState(true); 

  // Función para obtener libros desde el servidor (con paginación y filtros)
  const fetchBooks = useCallback(async (page, search, by, initial) => {
    setLoading(true);
    setError(null);

    try {
      // Construir los parámetros de consulta para la nueva ruta del servidor
      const params = {
        page,
        limit: LIMIT,
        search,
        searchBy: by,
        initialLoad: initial ? 'true' : 'false',
      };

      // Llamamos a la nueva ruta de búsqueda y paginación
      const response = await getBooksWithSearchAndPagination(params);

      // La respuesta del servidor ahora incluye la paginación
      setBooks(response.data.books);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);

      // Indicamos que la carga inicial ha terminado
      if (initial) setIsInitialLoad(false);

    } catch (error) {
      console.error("Error al cargar los libros:", error);
      // Usar error.response.data.message si el backend lo proporciona
      setError("No se pudieron cargar los libros. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect para la carga inicial
  useEffect(() => {
    // Carga inicial: página 1, sin búsqueda, ordenado por createdAt
    fetchBooks(1, searchTerm, searchBy, true);
  }, [fetchBooks]);

  // Manejar el envío del formulario de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Al buscar, siempre volvemos a la página 1 y deshabilitamos la carga inicial
    fetchBooks(1, searchTerm, searchBy, false);
  };

  // Manejar el cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Al cambiar de página, mantenemos el término de búsqueda y el criterio actual
      // y deshabilitamos la carga inicial
      fetchBooks(newPage, searchTerm, searchBy, false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Cargando libros...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p className={styles['error-message']}>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <h2>Libros de los usuarios</h2>

          {/* 8. Formulario de Búsqueda Integrado */}
          <form onSubmit={handleSearchSubmit} className={styles['search-form']}>
            <input 
              type="text"
              placeholder="Buscar título, autor o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles['search-input']}
            />
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className={styles['search-select']}
            >
              <option value="title">Título</option>
              <option value="author">Autor</option>
              <option value="category">Categoría</option>
            </select>
            <button type="submit" className={styles['search-button']}>Buscar</button>
          </form>

          {/* 9. Mostrar resultados */}
          <div className={styles['book-cards-grid']}>
            {books.length > 0 ? (
              books.map(book => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <p>
                {isInitialLoad
                  ? "Cargando el catálogo..."
                  : "No se encontraron libros que coincidan con tu búsqueda."
                }
              </p>
            )}
          </div>

          {/* 10. Controles de Paginación */}
          {totalPages > 1 && (
            <div className={styles['pagination-controls']}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles['pagination-button']}
              >
                Anterior
              </button>
              <span className={styles['pagination-info']}>Página {currentPage} de {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles['pagination-button']}
              >
                Siguiente
              </button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );

}

export default Home;