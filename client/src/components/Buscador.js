import React from 'react';

function Buscador({ setFiltro, categorias, setCategoriaSeleccionada, categoriaSeleccionada }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="busqueda" className="form-label">Buscar por título o autor</label>
              <input
                type="text"
                className="form-control"
                id="busqueda"
                placeholder="Ingresa tu búsqueda"
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">Filtrar por categoría</label>
              <select
                className="form-select"
                id="categoria"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buscador;