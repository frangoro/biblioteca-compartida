/**
 * Formulario de creación y edición de usuarios
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as userService from '../services/userService'; // Tu servicio de API
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import styles from './UserFormPage.module.css';

function UserFormPage() {
  const { id } = useParams(); // Obtiene el ID de la URL si existe (para edición)
  const navigate = useNavigate(); // Para redirigir después de guardar
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Solo para creación o si se permite cambiar en edición
    role: 'user', // Rol por defecto
    profilePicUrl: '',
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
          const user = await userService.getUserById(id);
          setFormData({
            username: user.username,
            email: user.email,
            // No cargar la contraseña por seguridad
            role: user.role,
            profilePicUrl: user.profilePicUrl || '', // Cargar la URL existente
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

  // Callback que se ejecuta cuando ProfilePictureUpload sube una imagen a Cloudinary
  const handleProfilePicUploadComplete = (newProfilePicUrl) => {
    // Aquí es donde actualizamos el estado del formulario principal con la nueva URL
    setFormData((prevData) => ({
      ...prevData,
      profilePicUrl: newProfilePicUrl,
    }));
    // No necesitas guardar aquí en la BD, se hará cuando el formulario principal se envíe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Valida que el email es un email válido (si no tienes una librería de validación)
    if (formData.email && !/.+@.+\..+/.test(formData.email)) {
      setError('Por favor, introduce un email válido.');
      return;
    }

    try {
      if (isEditing) {
        // Enviar todos los datos, incluida la `profilePicUrl` que ya está en `formData`
        await userService.updateUser(id, formData);
        alert('Usuario actualizado con éxito!');
      } else {
        await userService.createUser(formData);
        alert('Usuario creado con éxito!');
      }
      navigate('/admin/userlist'); // Redirigir de vuelta a la lista de usuarios
    } catch (err) {
      console.error('Error saving user:', err.response?.data?.message || err.message || err);
      setError(err.response?.data?.message || 'Error al guardar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) return <div>Cargando formulario...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-form-page">
      <h2>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      {error && <p className="error-message">{error}</p>}
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

        <ProfilePictureUpload
          initialProfilePicUrl={formData.profilePicUrl}
          onUploadComplete={handleProfilePicUploadComplete}
        />

        <div className="form-actions">
          <button type="submit" className={styles.button}>{isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
          <button type="button" className={`${styles.button} ${styles['secondary-button']}`} onClick={() => navigate('/admin/users')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default UserFormPage;