import React, { useState } from 'react';

function FormularioLibro({ agregarLibro }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('Bueno');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const handleImagenChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!titulo.trim() || !autor.trim() || !categoria.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    // Crear objeto de libro
    const nuevoLibro = {
      titulo,
      autor,
      categoria,
      estado,
      imagen: imagenPreview,
      propietario: 'Usuario actual', // En una app real vendría del sistema de autenticación
      fechaSubida: new Date().toISOString()
    };
    
    // Llamar a la función que agrega el libro al estado
    agregarLibro(nuevoLibro);
    
    // Resetear formulario
    setTitulo('');
    setAutor('');
    setCategoria('');
    setEstado('Bueno');
    setImagen(null);
    setImagenPreview(null);
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Añadir un nuevo libro</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">Título *</label>
            <input
              type="text"
              className="form-control"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="autor" className="form-label">Autor *</label>
            <input
              type="text"
              className="form-control"
              id="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="categoria" className="form-label">Categoría *</label>
            <input
              type="text"
              className="form-control"
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              placeholder="Ej: Novela, Ciencia ficción, Historia..."
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="estado" className="form-label">Estado del libro</label>
            <select
              className="form-select"
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="Como nuevo">Como nuevo</option>
              <option value="Excelente">Excelente</option>
              <option value="Bueno">Bueno</option>
              <option value="Aceptable">Aceptable</option>
              <option value="Deteriorado">Deteriorado</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="imagen" className="form-label">Fotografía (opcional)</label>
            <input
              type="file"
              className="form-control"
              id="imagen"
              accept="image/*"
              onChange={handleImagenChange}
            />
            {imagenPreview && (
              <div className="mt-2">
                <img src={imagenPreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Añadir libro</button>
        </form>
      </div>
    </div>
  );
}

export default FormularioLibro;