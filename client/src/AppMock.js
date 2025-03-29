import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import './AppMock.css';

const AppMock = () => {
  return (
    <Router>
      <Routes>//TODO Reestructurar las rutas cuando estén todas las pantallas. Ahora la pantalla inicial es la de Libros
        <Route path="/" element={<BookList />} />
        <Route path="/add" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/edit/:id" element={<BookForm onSave={() => window.location = '/'} />} />
      </Routes>
    </Router>
  );
};

export default AppMock;
