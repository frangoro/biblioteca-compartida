/**
 * Renderiza la página correspondiente a la ruta que se está accediendo
 */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import BookDetails from './pages/BookDetails'; 
import Loans from './pages/Loans'; 
import AdminRoute from './components/AdminRoute';
import UserListPage from './pages/UserListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myBooks" element={<BookList />} />
        <Route path="/addBook" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/editBook/:id" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='' element={<AdminRoute />}>
            <Route path='/admin/userlist' element={<UserListPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;