import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../services/mockApiService'; //TODO Cambiar por el servicio real "api"

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await getBooks();
    setBooks(data);
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    fetchBooks();
  };

  return (
    <div>
      <h1>Mis Libros</h1>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <button onClick={() => handleDelete(book._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
