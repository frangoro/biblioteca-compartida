import React, { useState } from 'react';
import { addBook, updateBook } from '../services/bookService';

const BookForm = ({ book, onSave }) => {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (book) {
      await updateBook(book._id, formData);
    } else {
      await addBook(formData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Título"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Autor"
        value={formData.author}
        onChange={handleChange}
      />
      <button type="submit">Guardar</button>
    </form>
  );
};

export default BookForm;
