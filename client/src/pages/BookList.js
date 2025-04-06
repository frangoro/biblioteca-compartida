import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook, addBook } from '../services/api';
import { Button, Table, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const BookList = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", author: "", category: "", condition: "", isAvailable: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Actualizar
      setItems(items.map(item => item.id === formData.id ? formData : item));
    } else {
      // Crear
      addBook(formData);
      setItems([...items, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setFormData({ id: "", title: "", author: "", category: "", condition: "", isAvailable: "" });
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
            <th>Condición</th>
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
              <td>{item.isAvailable}</td>
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
          <Modal.Title>{formData.id ? "Editar" : "Agregar"}</Modal.Title>
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
              <Form.Label>Condición</Form.Label>
              <Form.Control
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Usuario</Form.Label> //TODO: rellenar automático
              <Form.Control
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                required
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
              <Form.Label>Disponibilidad</Form.Label>
              <Form.Control
                type="text"
                name="isAvailable"
                value={formData.isAvailable}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
/*
  const registerUser = async () => {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: "Juan",
          email: "juan@example.com",
          password: "123456"
      });
      console.log(response.data);
  };*/
  




/*
  return (
    <div>
      <h1>Mis Libros</h1>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <button onClick={() => handleDelete(book._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
  */
};

export default BookList;
