/* Barra de búsqueda */

import React, { useState } from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // Llama a la función onSearch inmediatamente con el nuevo valor
    onSearch({ searchTerm: newSearchTerm });
  };

  return (
      <input
        type="text"
        placeholder="Buscar por título o autor..."
        value={searchTerm}
        onChange={handleInputChange}
        className={styles['search-input']}
        
      />
  );
}

export default SearchBar;