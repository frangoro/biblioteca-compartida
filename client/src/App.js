import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import BookDetails from './pages/BookDetails'; 
import Loans from './pages/Loans'; 
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>//TODO Añadir todas las páginas que faltan
        <Route path="/" element={<Home />} />
        <Route path="/myBooks" element={<BookList />} />
        <Route path="/addBook" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/editBook/:id" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/loans" element={<Loans />} />
      </Routes>
    </Router>
  );
};

export default App;