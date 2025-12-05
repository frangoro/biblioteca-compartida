// Controlador para buscar libros con paginación y búsqueda por título, autor o categoría.

import Book from '../models/Book.js';

export const getBooksWithSearchAndPagination = async (req, res) => {
  try {
    // 1. Obtener Parámetros de la Consulta
    const { 
      page = 1,                 // Página actual, por defecto 1
      limit = 50,               // Libros por página, por defecto 50
      search = '',              // Texto de búsqueda
      searchBy = 'title',       // Criterio de búsqueda: 'title', 'author', 'category'
      initialLoad = 'true'      // Carga inicial para ordenar por 'createdAt'
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    // 2. Construir el Filtro (query)
    let filter = {};
    const searchRegex = new RegExp(search, 'i'); // 'i' para búsqueda insensible a mayúsculas/minúsculas

    // Si hay texto de búsqueda, aplicamos el filtro en el campo seleccionado
    if (search && searchBy) {
      if (['title', 'author', 'category'].includes(searchBy)) {
        filter[searchBy] = searchRegex;
      }
    }

    // 3. Determinar el Ordenamiento (sort)
    // Para la carga inicial (o cuando no hay búsqueda), ordenamos por 'createdAt' descendente.
    // Si hay búsqueda, el orden predeterminado puede ser por título o relevancia, pero para empezar,
    // mantengamos el orden por 'createdAt' a menos que haya un criterio de ordenamiento explícito (que puedes añadir después).
    let sortCriteria = {};
    if (initialLoad === 'true' && !search) {
      sortCriteria = { createdAt: -1 }; // -1 para descendente (últimos añadidos)
    } else {
      sortCriteria = { title: 1 }; // Orden alfabético por título para resultados de búsqueda
    }


    // 4. Ejecutar la Consulta a MongoDB
    // Uso de .skip() y .limit() para la paginación
    const books = await Book.find(filter)
      .sort(sortCriteria)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // 5. Obtener el Total de Documentos
    const totalCount = await Book.countDocuments(filter);

    // 6. Enviar la Respuesta
    res.status(200).json({
      books,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
      totalBooks: totalCount,
    });

  } catch (error) {
    console.error("Error en getBooksWithSearchAndPagination:", error);
    res.status(500).json({ message: 'Error al buscar y paginar libros', error });
  }
};