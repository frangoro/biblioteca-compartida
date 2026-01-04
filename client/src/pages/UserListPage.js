/**
 * CRUD para la gestión de usuarios por parte del administrador
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../services/userService';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Inicializa useNavigate

    // Función para cargar los usuarios, hecha useCallback para eficiencia
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            // Tu función getAllUsers debería ser parte de userService.js
            const response = await userService.getAllUsers();
            // Asegúrate de que 'response.data.data' es donde se encuentra el array de usuarios.
            // Si es directamente 'response.data', usa 'setUsers(response.data);'
            setUsers(response.data); 
            setError(null);
        } catch (err) {
            // Asegúrate de que el error.response exista si usas Axios para errores detallados
            setError(err.response?.data?.message || err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, []); // Dependencias vacías, se crea una sola vez

    useEffect(() => {
        fetchUsers(); // Llama a fetchUsers cuando el componente se monta
    }, [fetchUsers]); // Ejecuta cuando fetchUsers cambie (aunque en este caso no lo hará)

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await userService.deleteUser(userId); // Llama a la función de tu servicio
                // Refresca la lista de usuarios filtrando el eliminado
                setUsers(users.filter(user => user.id !== userId));
                alert('Usuario eliminado con éxito.');
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Error al eliminar el usuario');
            }
        }
    };

    // Función para navegar a la página de creación de usuario
    const handleCreateClick = () => {
        navigate('/admin/users/create'); // Ruta definida en App.js
    };

    // Función para navegar a la página de edición de usuario
    const handleEditClick = (userId) => {
        navigate(`/admin/users/${userId}/edit`); // Ruta con parámetro :id definida en App.js
    };

    // Filtra los usuarios según el término de búsqueda
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p className="text-center my-5">Cargando usuarios...</p>;
    
    // Usamos la clase de alerta de Bootstrap para el mensaje de error
    if (error) return (
        <div className="alert alert-danger" role="alert">
            <p className="mb-0">Error: {error}</p>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Header />
            <main className="page-content">
            <div className="container">
            <div className="container mt-5">
            <h1 className="my-4">Administración de Usuarios</h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={handleCreateClick} className="btn btn-primary">
                    Crear Nuevo Usuario
                </button>
                <input
                    type="text"
                    placeholder="Buscar por nombre de usuario o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-50"
                />
            </div>

            {/* Tabla con estilos de Bootstrap */}
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Admin</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role === 'admin' ? 'Sí' : 'No'}</td>
                                {/* Columna de acciones */}
                                <td>
                                    {/* Botones de acción con clases de Bootstrap */}
                                    <button onClick={() => handleEditClick(user.id)} className="btn btn-warning btn-sm me-2">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No se encontraron usuarios.</td>
                        </tr>
                    )}
                </tbody>
            </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserListPage;