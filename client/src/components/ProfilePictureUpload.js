/**
 * Componente de subida de imágenes para integrar en el formulario de usuario y libro
 */
import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance'; // Tu instancia configurada de Axios

function ProfilePictureUpload({ userId, currentProfilePicUrl, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentProfilePicUrl);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Crea una URL temporal para la previsualización
    } else {
      setSelectedFile(null);
      setPreview(currentProfilePicUrl); // Vuelve a la URL actual si no se selecciona nada
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Por favor, selecciona una imagen para subir.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('profilePicture', selectedFile); // 'profilePicture' debe coincidir con el campo de Multer en el backend

    try {
      // Envía la imagen al endpoint de tu backend
      const response = await axiosInstance.put(`/api/users/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Importante para enviar archivos
        },
      });

      alert('Foto de perfil actualizada con éxito!');
      if (onUploadSuccess) {
        onUploadSuccess(response.data.profilePicUrl); // Pasa la nueva URL al componente padre
      }
      setSelectedFile(null); // Limpiar el input de archivo
      URL.revokeObjectURL(preview); // Libera la URL de previsualización
      setPreview(response.data.profilePicUrl); // Actualiza la previsualización con la URL real
    } catch (err) {
      console.error('Error al subir la imagen:', err.response || err);
      setError(err.response?.data?.message || 'Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-upload-container">
      <h3>Cambiar Foto de Perfil</h3>
      {preview && (
        <img src={preview} alt="Previsualización de perfil" className="current-profile-pic" />
      )}
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        <button type="submit" disabled={!selectedFile || uploading}>
          {uploading ? 'Subiendo...' : 'Subir Foto'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default ProfilePictureUpload;