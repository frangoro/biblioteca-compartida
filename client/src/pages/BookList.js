/* Página que muestra la lista de libros del usuario actual */
import React, { useCallback, useEffect, useState } from 'react';
import { deleteBook, addBook, updateBook, getBooksQuery } from '../services/bookService';
import { Button, Table, Modal, Form } from "react-bootstrap";
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './BookList.module.css';

const BookList = () => {

  const [books, setBooks] = useState([]); // lista de libros que se muestran en la tabla
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: true, image:"" }); // campos del formulario de crear/editar libro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const finalValue = (value === 'true') ? true : (value === 'false') ? false : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData._id) {
      // Editar
      const res = await updateBook(formData._id, formData); 
      setBooks(books.map(item => item._id === formData._id ? res.data : item));
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
    setBooks(books.filter(item => item._id !== id));
  };

  // Carga todos los libros del usuario al principio
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBooksQuery({});
      setBooks(response.data);
    } catch (error) {
      console.error("Error al cargar los libros:", error);
      setError("No se pudieron cargar los libros. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Maneja la búsqueda de libros
  const handleSearch = (newFilters) => {
    setSearchTerm(newFilters.searchTerm);
  };

  // Obtiene los libros filtrados según el término de búsqueda
  const filteredBooks = books.filter(book => {
    if (!searchTerm) {
      return true; // Si no hay término, muestra todos
    }
    const term = searchTerm.toLowerCase();
    
    // Define tus campos de búsqueda (Título, Autor, etc.)
    return book.title.toLowerCase().includes(term) || 
          book.author.toLowerCase().includes(term);
  });

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
            <SearchBar className={styles['searchBar']} onSearch={handleSearch} />
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
                {filteredBooks.map(item => (
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
            <Button className={styles['addButton']} variant="primary" onClick={() => setShowModal(true)}>Agregar nuevo libro</Button>

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
