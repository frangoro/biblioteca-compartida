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
                setUsers(users.filter(user => user._id !== userId));
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

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>;

    return (
        <div className="user-list-container"> {/* Contenedor principal con clase para estilos */}
         <Header />
            <h1>Administración de Usuarios</h1>
            
            <div className="user-list-controls">
                {/* Botón para crear nuevo usuario */}
                <button onClick={handleCreateClick} className="create-user-button">
                    Crear Nuevo Usuario
                </button>

                {/* Barra de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por nombre de usuario o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role === 'admin' ? 'Sí' : 'No'}</td>
                                <td className="actions-column">
                                    <button onClick={() => handleEditClick(user._id)} className="edit-button">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(user._id)} className="delete-button">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No se encontraron usuarios.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Footer />
        </div>
    );
};

export default UserListPage;