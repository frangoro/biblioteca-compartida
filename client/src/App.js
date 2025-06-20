import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>//TODO Añadir todas las páginas que faltan
        <Route path="/" element={<Home />} />
        <Route path="/myBooks" element={<BookList />} />
        <Route path="/addBook" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/editBook/:id" element={<BookForm onSave={() => window.location = '/'} />} />
      </Routes>
    </Router>
  );
};

export default App;