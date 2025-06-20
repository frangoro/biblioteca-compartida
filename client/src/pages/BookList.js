import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook, addBook, updateBook } from '../services/api';
import { Button, Table, Modal, Form } from "react-bootstrap";
import Buscador from '../components/Buscador';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BookList = () => {
  const [items, setItems] = useState([]); // lista de libros que se muestran en la tabla
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: true, image:"" }); // campos del formulario de crear/editar libro
  const [filtro, setFiltro] = useState('');
  const categorias = [...new Set(items.map(item => item.category))];
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  
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
      setItems(items.map(item => item._id === formData._id ? formData : item));
    } else {
      // Crear
      const res = await addBook(formData); // Crea y devuelve el libro creado
      setItems([...items, res.data.newBook]); // Añade al listado el nuevo libro con los datos de la BBDD
  
    }
    setShowModal(false);
    setFormData({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: true, image:"" });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };

  const fetchBooks = async () => {
    const { data } = await getBooks();
    setItems(data);
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
                {items.map(item => (
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
