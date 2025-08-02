/**
 * Formulario de creación y edición de usuarios
 */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as userService from '../services/userService';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import { useAuth } from '../context/AuthContext';
import styles from './UserFormPage.module.css';

function UserFormPage() {
  const { id } = useParams(); // Obtiene el ID de la URL si existe (para edición)
  const { userInfo } = useAuth(); // Usuario actual del contexto
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

  // Lógica para determinar si un administrador está editando
  // o si es el propio usuario editando su perfil
  const isSelfEditing = userInfo && id === userInfo.id;
  const isAdminEditing = userInfo && userInfo.role === 'admin' && id;

  const location = useLocation();
  // Lógica para determinar si es una página de creación
  const isCreatePage = location.pathname === '/admin/users/create';

  useEffect(() => {
    // Determinar el ID del usuario a editar
    // Si hay un ID en la URL, es una edición de administrador.
    // Si no, es la edición del perfil del usuario actual.
    const userIdToEdit = isCreatePage ? null : id || userInfo?._id;
    if (userIdToEdit) {
      setIsEditing(true);
      // Cargar datos del usuario para edición
      const fetchUser = async () => {
        try {
          setLoading(true);
          const user = await userService.getUserById(userIdToEdit);
          setFormData({
            username: user.username,
            email: user.email,
            // No cargar la contraseña por seguridad
            role: user.role || 'user',
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
      // Si no hay ID en la URL y no hay usuario logueado, es una creación (ruta /admin/users/create)
      setIsEditing(false);
      setLoading(false);
    }
  }, [id, userInfo, isCreatePage]); // Dependencia del ID para re-ejecutar si cambia

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

    const userIdToUpdate = id || userInfo?._id; // Usamos el ID correcto para la llamada a la API

    // Valida que el email es un email válido (si no tienes una librería de validación)
    if (formData.email && !/.+@.+\..+/.test(formData.email)) {
      setError('Por favor, introduce un email válido.');
      return;
    }

    try {
      if (isEditing) {
        // Enviar todos los datos, incluida la `profilePicUrl` que ya está en `formData`
        await userService.updateUser(userIdToUpdate, formData);
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

  if (loading) return <div className="text-center my-5">Cargando formulario...</div>;
  if (error) return (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4">{isEditing && !isCreatePage? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      
      <form onSubmit={(e) => handleSubmit(e, id || userInfo?.id)}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nombre:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control" 
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control" 
            required
          />
        </div>
        
        {(!isEditing || isSelfEditing) && ( 
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control" 
              required
            />
          </div>
        )}
        
        {(isAdminEditing || isCreatePage) && (
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rol:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select" 
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        )}

        <ProfilePictureUpload
          initialProfilePicUrl={formData.profilePicUrl}
          onUploadComplete={handleProfilePicUploadComplete}
        />

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/userlist')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormPage;