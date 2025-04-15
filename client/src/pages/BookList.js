import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook, addBook, updateBook } from '../services/api';
import { Button, Table, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const BookList = () => {
  const [items, setItems] = useState([]); // lista de libros que se muestran en la tabla
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: "", image:"" }); // campos del formulario de crear/editar libro

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      // Actualizar
      updateBook(formData._id, formData);
      setItems(items.map(item => item._id === formData._id ? formData : item));
    } else {
      // Crear
      addBook(formData);
      setItems([...items, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setFormData({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: "", image:"" });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };

  const fetchBooks = async () => {
    const { data } = await getBooks();
    console.log(data);
    setItems(data);
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    fetchBooks();
  };

  /*const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };*/

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container mt-5">
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
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.category}</td>
              <td>{item.condition}</td>
              <td>{item.isAvailable ? 'Disponible' : 'No disponible'}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(item)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
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
                checked={formData.isAvailable === true}
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
  );
};

export default BookList;
