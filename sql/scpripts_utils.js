// Scripts de utilidad para la base de datos de la biblioteca compartida

// Actualiza el documento del usuario con el ID especificado.
db.users.updateOne( { _id: ObjectId("66301a1f4d4b4a001a234b10") }, { $set: { password: "$2b$10$RX7/XEAQt8pRlfk48JiX7OfmsvtYSNr.r7pCNIAtkml9lAj3EaNGi" } });

// Actualiza el documento del libro con el ID especificado.
db.books.updateOne( { _id: ObjectId("88301a1f4d4b4a001a235c11") }, { $set: { image: "https://res.cloudinary.com/dpeuvi6qk/image/upload/v1753705325/default_t9xsep.png" } });

db.books.updateOne( { _id: ObjectId("688ce601a7a2b2b70e537daf") }, { $set: { owner: ObjectId('66301a1f4d4b4a001a234b10'), isAvailable: false } });

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
