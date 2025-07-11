/**
 * CRUD para la gestión de usuarios por parte del administrador
 */
import React, { useState, useEffect } from 'react';
import { getAllUsers, searchUsers, deleteUser } from '../services/api'; 

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getAllUsers(); // Llama a la API para obtener usuarios
                setUsers(data.data);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar usuarios');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await deleteUser(userId);
                // Refresca la lista de usuarios filtrando el eliminado
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                setError(err.message || 'Error al eliminar el usuario');
            }
        }
    };

    // Filtra los usuarios según el término de búsqueda
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h1>Administración de Usuarios</h1>
            
            {/* Botón para crear nuevo usuario (te llevaría a otra página o abriría un modal) */}
            <button onClick={() => {/* Lógica para ir a crear usuario */}}>
                Crear Usuario
            </button>

            {/* Barra de búsqueda */}
            <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ margin: '20px 0', padding: '10px', width: '300px' }}
            />

            <table>
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
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role === 'admin' ? 'Sí' : 'No'}</td>
                            <td>
                                <button onClick={() => {/* Lógica para editar */}}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(user._id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserListPage;