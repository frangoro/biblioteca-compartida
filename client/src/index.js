/**
 * Aquí se renderiza la aplicación
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';
import { library } from '@fortawesome/fontawesome-svg-core'; // Importa librería Font Awesome
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de usuario que queremos

// Añade los iconos a la librería global de Font Awesome
// Esto los hace disponibles para cualquier componente <FontAwesomeIcon>
library.add(faUserCircle);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();