/**
 * Formulario de creación y edición de usuarios
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as userService from '../services/userService'; // Tu servicio de API
//import './UserFormPage.css'; //TODO: Para estilos del formulario
//import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePictureUpload from '../components/ProfilePictureUpload';

function UserFormPage() {
  const { id } = useParams(); // Obtiene el ID de la URL si existe (para edición)
  const navigate = useNavigate(); // Para redirigir después de guardar
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Solo para creación o si se permite cambiar en edición
    role: 'user', // Rol por defecto
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      // Cargar datos del usuario para edición
      const fetchUser = async () => {
        try {
          setLoading(true);
          const user = await userService.getUserById(id); // Asume que tienes esta función
          setFormData({
            username: user.username,
            email: user.email,
            // No cargar la contraseña por seguridad
            role: user.role,
          });
        } catch (err) {
          setError('Error al cargar los datos del usuario.');
          console.error('Error fetching user:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setIsEditing(false);
      setLoading(false);
    }
  }, [id]); // Dependencia del ID para re-ejecutar si cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos
    try {
      if (isEditing) {
        // Llamar a la función updateUser de tu servicio de API
        await userService.updateUser(id, formData);
        alert('Usuario actualizado con éxito!');
      } else {
        // Llamar a la función createUser de tu servicio de API
        await userService.createUser(formData);
        alert('Usuario creado con éxito!');
      }
      navigate('/admin/userlist'); // Redirigir de vuelta a la lista de usuarios
    } catch (err) {
      setError('Error al guardar el usuario. Por favor, inténtalo de nuevo.');
      console.error('Error saving user:', err);
    }
  };

  const handleProfilePicUploadSuccess = (newUrl) => {
    // Cuando la foto se suba con éxito, actualiza el estado del usuario en UserFormPage
    // para que la URL de la foto de perfil del formulario refleje la nueva imagen.
    setFormData(prevData => ({ ...prevData, profilePicUrl: newUrl }));
    // También podrías guardar la nueva URL en el localStorage si tienes la info del usuario ahí
    // const storedUser = JSON.parse(localStorage.getItem('user'));
    // if (storedUser) {
    //   localStorage.setItem('user', JSON.stringify({ ...storedUser, profilePicUrl: newUrl }));
    // }
  };

  if (loading) return <div>Cargando formulario...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-form-page">
      <h2>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {!isEditing && ( // Contraseña solo para creación
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="role">Rol:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="form-group">
        <ProfilePictureUpload
          userId={id} // El ID del usuario que se está editando
          currentProfilePicUrl={formData.profilePicUrl} // La URL actual del perfil
          onUploadSuccess={handleProfilePicUploadSuccess}
        />
        </div>
        <button type="submit">{isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
        <button type="button" onClick={() => navigate('/admin/users')}>Cancelar</button>
      </form>
    </div>
  );
}

export default UserFormPage;