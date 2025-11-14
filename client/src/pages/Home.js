/* Página principal que muestra la lista de libros de todos los usuarios */

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard'; 
import SearchBar from '../components/SearchBar'; 
import styles from "./Home.module.css";

function Home() {
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: ''});
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Utilizamos useCallback para memorizar la función y evitar re-creaciones innecesarias
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construye la URL con parámetros del filtro de búsqueda que inicialmente es un objeto vacío
      // con lo que cargará todos los libros
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/books?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data); // Inicialmente, todos los libros están filtrados
    } catch (error) {
      console.error("Error al cargar los libros:", error);
      setError("No se pudieron cargar los libros. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Maneja la búsqueda de libros
  const handleSearch = ({ searchTerm }) => {
    // Si el término de búsqueda está vacío, muestra todos los libros
    if (!searchTerm) {
        setFilteredBooks(books);
    } else {
        // Filtra la lista de libros en base al término de búsqueda
        console.log(books[0].title);
        const results = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBooks(results);
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
          <SearchBar onSearch={handleSearch} />
          <div className={styles['book-cards-grid']}>
            {books.length > 0 ? (
              filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
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