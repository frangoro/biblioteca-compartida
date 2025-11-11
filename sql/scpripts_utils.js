// Scripts de utilidad para la base de datos de la biblioteca compartida

// Mostrar los libros y sus propietarios
db.books.aggregate([
  {
    $lookup: {
      from: "users",          // colección con la que haces el join
      localField: "owner",  // campo en books (FK)
      foreignField: "_id",    // campo en users (PK)
      as: "owner"             // nombre del array resultante
    }
  },
  { $unwind: "$owner" },      // convierte el array en objeto
  {
    $project: {
      _id: 0,                 // opcional: oculta el _id
      title: 1,               // muestra solo el título del libro
      "owner.username": 1     // muestra solo el username del usuario
    }
  }
])
