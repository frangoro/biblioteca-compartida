/* Página que muestra la lista de libros del usuario actual */
import React, { useCallback, useEffect, useState } from 'react';
import { deleteBook, addBook, updateBook, getBooksQuery } from '../services/bookService';
import { Button, Table, Modal, Form, Dropdown } from "react-bootstrap";
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryFilter from '../components/CategoryFilter';
import IconCategoryDropdown from '../components/IconCategoryDropdown';
import { BiFilter } from 'react-icons/bi';
import styles from './BookList.module.css';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';

const BookList = () => {

  const [books, setBooks] = useState([]); // lista de libros que se muestran en la tabla
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: true, image: "" }); // campos del formulario de crear/editar libro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [globalFilter, setGlobalFilter] = useState(''); // Usaremos este para el SearchBar
  const [columnFilters, setColumnFilters] = useState([]); // Filtro de la columna Disponibilidad
  const [sorting, setSorting] = useState([]); // Estado para manejar la ordenación
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false); // Estado para el botón toggle

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
    setFormData({ _id: "", title: "", author: "", category: "", condition: "", isAvailable: true, image: "" });
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
      const response = await getBooksQuery({ myBooks: 'true' });
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

  const columns = [
    {
      accessorKey: 'title',
      header: 'Título',
      cell: info => <div style={{ fontWeight: 'bold' }}>{info.getValue()}</div>
    },
    {
      accessorKey: 'author',
      header: 'Autor',
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
      filterFn: 'includesString',
    },
    {
      accessorKey: 'condition',
      header: 'Observaciones',
    },
    {
      accessorKey: 'isAvailable',
      header: 'Disponibilidad',
      // Personalizamos la renderización para mostrar 'Disponible'/'No disponible' en lugar de true/false
      cell: info => (info.getValue() ? 'Disponible' : 'No disponible'),
    },
    {
      id: 'actions', // ID para las acciones (no tiene accessorKey ya que no es un campo de datos)
      header: 'Acciones',
      enableSorting: false, // Desactiva la ordenación en la columna de botones
      cell: ({ row }) => (
        <>
          <Button variant="warning" onClick={() => handleEdit(row.original)}>Editar</Button>
          <Button variant="danger" onClick={() => handleDelete(row.original._id)} className="ms-2">Eliminar</Button>
        </>
      ),
    },
  ];

  const table = useReactTable({
    data: books, // Tus datos
    columns, // La definición de columnas
    // Plugins necesarios
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Habilita la ordenación
    getFilteredRowModel: getFilteredRowModel(), // Habilita el filtrado

    // Gestión del estado de la tabla
    state: {
      sorting, // Usa el estado local de ordenación
      globalFilter, // Usa el estado local de filtro
      columnFilters,
    },
    onSortingChange: setSorting, // Función para actualizar el estado de ordenación
    onGlobalFilterChange: setGlobalFilter, // Función para actualizar el estado del filtro
    onColumnFiltersChange: setColumnFilters,
  });

  const handleSearch = (newFilters) => {
    // Asumimos que SearchBar devuelve un objeto con { searchTerm: 'valor' }
    setGlobalFilter(newFilters.searchTerm);
  };

  // Obtiene los valores únicos de la categoría para el filtro
  const getUniqueCategoryValues = () => {
    // Usamos Set para asegurar que los valores sean únicos
    const categories = new Set(books.map(book => book.category).filter(Boolean)); // filter(Boolean) para ignorar valores nulos o vacíos
    return Array.from(categories).sort();
  };

  const categoryColumn = table.getColumn('category');

  const rowsToShow = table.getRowModel().rows;
  const finalRows = showOnlyAvailable 
    ? rowsToShow.filter(row => row.original.isAvailable === true) 
    : rowsToShow;

  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
        <div className="container">
          <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* Controles de búsqueda y filtros por columna */}
              <div className="d-flex align-items-center">
                {/* SearchBar (Filtro Global) */}
                <SearchBar className={styles['searchBar']} onSearch={handleSearch} />

                {/* Filtro por Categoría */}
                {categoryColumn && <IconCategoryDropdown column={categoryColumn} books={books} />}
              </div>

              {/* Botón para mostrar sólo disponibles o todos */}
              <Button
                variant={showOnlyAvailable ? "success" : "secondary"}
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              >
                {showOnlyAvailable ? "Mostrando Solo Disponibles" : "Mostrar Solo Disponibles"}
              </Button>
            </div>
            {loading ? (
              <p>Cargando libros...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <>
                <Table striped bordered hover className="mt-3">

                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            // Añade el handler de click para ordenar
                            onClick={header.column.getToggleSortingHandler()}
                            // Muestra el puntero si la columna es ordenable
                            style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                          >
                            {/* Renderiza el contenido del encabezado */}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {/* Muestra el icono de ordenación (⬆️/⬇️) */}
                            {{
                              asc: ' ⬆️',
                              desc: ' ⬇️',
                            }[header.column.getIsSorted()] ?? null}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  {/* Tbody dinámico para Filas y Ordenación/Filtrado */}
                  <tbody>
                    {/* finalRows solo contiene las filas filtradas y ordenadas */}
                    {finalRows.length > 0 ? (
                      finalRows.map(row => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                              {/* Renderiza el contenido de la celda */}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No se encontraron libros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Button className={styles['addButton']} variant="primary" onClick={() => setShowModal(true)}>Agregar nuevo libro</Button>
              </>
            )}
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
