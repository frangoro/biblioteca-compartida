import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../services/api'; //TODO Cambiar por el servicio real "api"
import { Button, Table, Modal, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const libros = [
  { id: "1", title: "El Principito", author: "Antoine de Saint-Exupéry", status: "Disponible", user: "Fran Gomez" },
  { id: "2", title: "Cien años de soledad", author: "Gabriel García Márquez", status: "Prestado", user: "Ana López" },
  { id: "3", title: "1984", author: "George Orwell", status: "Disponible", user: "Carlos Ruiz" },
  { id: "4", title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", status: "Prestado", user: "María García" },
  { id: "5", title: "Orgullo y prejuicio", author: "Jane Austen", status: "Disponible", user: "Laura Martínez" },
  { id: "6", title: "Matar a un ruiseñor", author: "Harper Lee", status: "Prestado", user: "Javier Pérez" },
  { id: "7", title: "El Hobbit", author: "J.R.R. Tolkien", status: "Disponible", user: "Sofía Fernández" },
  { id: "8", title: "Crónica de una muerte anunciada", author: "Gabriel García Márquez", status: "Prestado", user: "Daniel Gómez" },
  { id: "9", title: "El Gran Gatsby", author: "F. Scott Fitzgerald", status: "Disponible", user: "Elena Sánchez" },
  { id: "10", title: "La sombra del viento", author: "Carlos Ruiz Zafón", status: "Prestado", user: "Pedro Díaz" }
];


const BookList = () => {
  const [books, setBooks] = useState([]);
  const [items, setItems] = useState(libros); // parece que hay que meter algo por defecto para que funcione el useEffect, ya que antes de ejecutarse el useEffect parece que renderiza el html donde necesita algo en items.
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", author: "" });

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
      setItems([...items, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setFormData({ id: "", title: "", author: "" });
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
            <th>Estado</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.status}</td>
              <td>{item.user}</td>
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
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="user"
                value={formData.user}
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
