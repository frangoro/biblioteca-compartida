import React, { useState, useEffect } from 'react';
import './App.css';
import FormularioLibro from './components/FormularioLibro';
import ListadoLibros from './components/ListadoLibros';
import Buscador from './components/Buscador';

function App() {
  const [libros, setLibros] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  // Simulación de carga de datos (en una app real sería una API)
  useEffect(() => {
    const librosIniciales = [
      { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', categoria: 'Novela', estado: 'Excelente', propietario: 'María', imagen: null },
      { id: 2, titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', categoria: 'Ficción', estado: 'Bueno', propietario: 'Juan', imagen: null },
      { id: 3, titulo: 'Clean Code', autor: 'Robert C. Martin', categoria: 'Programación', estado: 'Como nuevo', propietario: 'Carlos', imagen: null },
    ];
    setLibros(librosIniciales);
  }, []);

  const agregarLibro = (nuevoLibro) => {
    nuevoLibro.id = libros.length > 0 ? Math.max(...libros.map(l => l.id)) + 1 : 1;
    setLibros([...libros, nuevoLibro]);
  };

  const librosFiltrados = libros.filter(libro => {
    const coincideTitulo = libro.titulo.toLowerCase().includes(filtro.toLowerCase());
    const coincideAutor = libro.autor.toLowerCase().includes(filtro.toLowerCase());
    const coincideCategoria = categoriaSeleccionada === '' || libro.categoria === categoriaSeleccionada;
    return (coincideTitulo || coincideAutor) && coincideCategoria;
  });

  const categorias = [...new Set(libros.map(libro => libro.categoria))];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Biblioteca Compartida</h1>
      </header>
      <main className="container">
        <h2>Gestión de Libros</h2>
        
        <div className="row">
          <div className="col-md-4">
            <FormularioLibro agregarLibro={agregarLibro} />
          </div>
          
          <div className="col-md-8">
            <Buscador 
              setFiltro={setFiltro} 
              categorias={categorias} 
              setCategoriaSeleccionada={setCategoriaSeleccionada}
              categoriaSeleccionada={categoriaSeleccionada}
            />
            <ListadoLibros libros={librosFiltrados} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;