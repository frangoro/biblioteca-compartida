// src/components/SearchBar.js
import React, { useState } from 'react';
import '../styles/SearchBar.css'; // Crea este archivo CSS

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el recargado de la página
    // Llama a la función onSearch pasada desde el componente padre (Home.js)
    onSearch({ searchTerm, authorFilter });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar por título o descripción..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <input
        type="text"
        placeholder="Filtrar por autor..."
        value={authorFilter}
        onChange={(e) => setAuthorFilter(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">Buscar</button>
    </form>
  );
}

export default SearchBar;