/* Página que muestra la lista de libros del usuario actual */

import React, { useCallback, useEffect, useState } from 'react';
import { deleteBook, addBook, updateBook, getBooksQuery } from '../services/bookService';
import { Button, Table, Modal, Form } from "react-bootstrap";
import Buscador from '../components/Buscador';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BookList = () => {

  const [books, setBooks] = useState([]); // lista de libros que se muestran en la tabla
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: true, image:"" }); // campos del formulario de crear/editar libro
  const [filtro, setFiltro] = useState('');
  const categorias = [...new Set(books.map(item => item.category))];
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: ''});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue;
    if (value === "true") {
      parsedValue = true;
    } else if (value === "false") {
      parsedValue = false;
    } else {
      parsedValue = value;
    }
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData._id) {
      // Actualizar
      updateBook(formData._id, formData);
      setBooks(books.map(item => item._id === formData._id ? formData : item));
    } else {
      // Crear
      const res = await addBook(formData); // Crea y devuelve el libro creado
      setBooks([...books, res.data.newBook]); // Añade al listado el nuevo libro con los datos de la BBDD
  
    }
    setShowModal(false);
    setFormData({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: true, image:"" });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };



  const handleDelete = async (id) => {
    await deleteBook(id);
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construye la URL con parámetros de consulta
      const queryParams = new URLSearchParams(filters).toString();
      const response = await getBooksQuery(queryParams);
      setBooks(response.data);
    } catch (error) {
      console.error("Error al cargar los libros:", error);
      setError("No se pudieron cargar los libros. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, [filters]); // La función se re-crea solo si 'filters' cambia

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // Dispara la carga cuando fetchBooks (y por lo tanto filters) cambie

  const handleSearch = (newFilters) => {
    setFilters(newFilters); // Actualiza los filtros, lo que disparará useEffect
  };

    if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p>Cargando libros...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <p className="error-message">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <div className="container mt-5">
            <Buscador 
                    setFiltro={setFiltro} 
                    categorias={categorias} 
                    setCategoriaSeleccionada={setCategoriaSeleccionada}
                    categoriaSeleccionada={categoriaSeleccionada}
                  />
            <SearchBar onSearch={handleSearch} />
            <Button variant="primary" onClick={() => setShowModal(true)}>Agregar</Button>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Categoría</th>
                  <th>Observaciones</th>
                  <th>Disponibilidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {books.map(item => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.category}</td>
                    <td>{item.condition}</td>
                    <td>{item.isAvailable ? 'Disponible' : 'No disponible'}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleEdit(item)}>Editar</Button>
                      <Button variant="danger" onClick={() => handleDelete(item._id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{formData._id ? "Editar" : "Agregar"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Autor</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control
                      type="text"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Disponibile</Form.Label>
                    <Form.Check
                      type="radio"
                      label="Sí"
                      name="isAvailable"
                      value="true"
                      checked={formData.isAvailable === true || formData._id === ""}
                      onChange={handleInputChange}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="No"
                      name="isAvailable"
                      value="false"
                      checked={formData.isAvailable === false}
                      onChange={handleInputChange}
                      inline
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">Guardar</Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookList;
