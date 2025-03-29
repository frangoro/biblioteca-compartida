import React from 'react';

function ListadoLibros({ libros }) {
  if (libros.length === 0) {
    return (
      <div className="alert alert-info">
        No hay libros que coincidan con tu búsqueda.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {libros.map(libro => (
        <div key={libro.id} className="col">
          <div className="card h-100">
            {libro.imagen ? (
              <img src={libro.imagen} className="card-img-top" alt={libro.titulo} style={{ height: '200px', objectFit: 'cover' }} />
            ) : (
              <div className="bg-light text-center py-5" style={{ height: '200px' }}>
                <i className="bi bi-book" style={{ fontSize: '4rem' }}></i>
              </div>
            )}
            
            <div className="card-body">
              <h5 className="card-title">{libro.titulo}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{libro.autor}</h6>
              <p className="card-text">
                <span className="badge bg-primary me-2">{libro.categoria}</span>
                <span className="badge bg-secondary">{libro.estado}</span>
              </p>
              <p className="card-text"><small className="text-muted">Propietario: {libro.propietario}</small></p>
            </div>
            
            <div className="card-footer">
              <button className="btn btn-outline-primary w-100">Solicitar préstamo</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListadoLibros;