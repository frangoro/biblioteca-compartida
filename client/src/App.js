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
import ProtectedRoute from './components/ProtectedRoute';
import UserFormPage from './pages/UserFormPage';
// Las rutas envueltas por el componente ProtectedRoute no pueden ser accedidas directamente sin autenticarse. 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myBooks" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
        <Route path="/addBook" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/editBook/:id" element={<BookForm onSave={() => window.location = '/'} />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='' element={<AdminRoute />}>
          <Route path='/admin/userlist' element={<ProtectedRoute><UserListPage /></ProtectedRoute>} />
          <Route path="/admin/users/create" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
          <Route path="/admin/users/:id/edit" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;