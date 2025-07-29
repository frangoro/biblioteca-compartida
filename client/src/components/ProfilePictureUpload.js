/**
 * Componente de subida de imágenes para integrar en el formulario de usuario y libro
 */
import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

function ProfilePictureUpload({ initialProfilePicUrl, onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(initialProfilePicUrl);

  // Actualiza la previsualización si initialProfilePicUrl cambia (ej. al cargar un nuevo usuario)
  useEffect(() => {
    setPreview(initialProfilePicUrl);
  }, [initialProfilePicUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Crea una URL temporal para la previsualización
      setError(null); // Limpia errores previos al seleccionar nuevo archivo
    } else {
      setSelectedFile(null);
      setPreview(initialProfilePicUrl);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona una imagen para subir.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      // Nota: Aquí la URL de subida podría ser una ruta genérica de "uploads" o la misma de usuario
      // Para este ejemplo, usaremos una ruta de usuario, asumiendo que el ID se manejará en el padre
      // o que tu backend tiene un endpoint de subida general para el usuario autenticado
      // que no requiere el ID en la URL si el token ya lo identifica.
      // Para que funcione con tu ruta PUT /api/users/:id/profile-picture, NECESITAS el ID.
      // Así que, podríamos pasar el userId como prop o usar la lógica de UserFormPage.

      // Simplificaremos asumiendo que el UserFormPage le pasará el ID para que el upload interno lo use
      // Esto significa que ProfilePictureUpload NECESITARÁ el `userId` como prop de nuevo.
      // Ojo: Si el UserFormPage tiene su propio `handleSubmit`, este componente debería SOLO subír,
      // y la URL resultante pasársela al padre.

      // Vamos a ajustar el diseño para que el padre (UserFormPage) sea quien haga la llamada a la API
      // al final, y este componente solo devuelva el archivo seleccionado o la URL de Cloudinary.

      // Mejor Opción: ProfilePictureUpload NO hace la llamada a la API, solo maneja el input y la previsualización
      // y notifica al padre sobre el archivo seleccionado.
      const response = await axiosInstance.post('/api/upload/profile-picture', formData, { // Ejemplo de una ruta de subida general
          headers: { 'Content-Type': 'multipart/form-Mdata' },
      });
      const newProfilePicUrl = response.data.profilePicUrl; // Asume que tu backend devuelve la URL

      alert('Imagen subida temporalmente. Guarda el formulario para confirmar.');
      if (onUploadComplete) {
        onUploadComplete(newProfilePicUrl); // Notifica al padre con la nueva URL
      }
      setSelectedFile(null);
      URL.revokeObjectURL(preview); // Libera la URL temporal
      setPreview(newProfilePicUrl); // Muestra la URL real
    } catch (err) {
      console.error('Error al subir la imagen:', err.response || err);
      setError(err.response?.data?.message || 'Error al subir la imagen.');
      if (onUploadComplete) {
        onUploadComplete(initialProfilePicUrl); // Vuelve a la URL original si falla la subida
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-upload-section">
      <h3>Foto de Perfil</h3>
      {preview ? (
        <img src={preview} alt="Previsualización de perfil" className="current-profile-pic" />
      ) : (
        <div className="no-profile-pic">No hay foto de perfil</div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {selectedFile && ( // Mostrar botón de subida solo si hay un archivo seleccionado
        <button type="button" onClick={handleUploadClick} disabled={uploading}>
          {uploading ? 'Subiendo...' : 'Subir y Previsualizar'}
        </button>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ProfilePictureUpload;