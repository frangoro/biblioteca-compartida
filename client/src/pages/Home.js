import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard'; 
import SearchBar from '../components/SearchBar'; 
import '../styles/Home.css';


function Home() {
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', authorFilter: '' });

  // Utilizamos useCallback para memoizar la función y evitar re-creaciones innecesarias
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construye la URL con parámetros de consulta
      const queryParams = new URLSearchParams(filters).toString();
      // En una aplicación real, aquí harías un 'fetch' a tu backend:
      const response = await fetch(`/api/books?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error al cargar los libros:", error);
      setError("No se pudieron cargar los libros. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, [filters]); // La función se re-crea solo si 'filters' cambia

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // Dispara la carga cuando fetchBooks (y por lo tanto filters) cambie

  const handleSearch = (newFilters) => {
    setFilters(newFilters); // Actualiza los filtros, lo que disparará useEffect
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
            <p className="error-message">{error}</p>
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
          <SearchBar onSearch={handleSearch} /> {/* Renderiza la barra de búsqueda */}
          <div className="book-cards-grid">
            {books.length > 0 ? (
              books.map(book => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <p>No se encontraron libros que coincidan con tu búsqueda.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

}

export default Home;