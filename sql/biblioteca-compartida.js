require('dotenv').config(); // Carga la URI desde el .env
const mongoose = require('mongoose');

// Definir el esquema y el modelo //TODO: importarlo desde los modelos reales
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, introduce un email válido'],
    },    
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Roles posibles
        default: 'user',        // Rol por defecto
    },
    profilePicUrl: {
    type: String,
    default: 'https://res.cloudinary.com/dpeuvi6qk/image/upload/v1753705325/default_t9xsep.png',
  },
},{timestamps: true});
const User = mongoose.model('User', userSchema);

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    condition: String, // estado del libro
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dpeuvi6qk/image/upload/v1753705325/default_t9xsep.png',
    },
    isAvailable: Boolean,
    createdAt: Date
});
const Book = mongoose.model('Book', bookSchema);

const loanSchema = new mongoose.Schema({
book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending'
  },
requestDate: Date,
approvalDate: Date,
returnDate: Date
});
const Loan = mongoose.model('Loan', loanSchema);

// Documentos
const users = [
{
    _id: new mongoose.Types.ObjectId('66301a1f4d4b4a001a234b10'),
    username: "admin",
    email: "frangoro@gmail.com",
    password: "$2b$10$RX7/XEAQt8pRlfk48JiX7OfmsvtYSNr.r7pCNIAtkml9lAj3EaNGi",
    role: 'admin'
},
{
    _id: new mongoose.Types.ObjectId('66301a1f4d4b4a001a234b11'),
    username: "María García",
    email: "maria@example.com",
    password: "$2b$10$EjemploHashSeguro123",
    role: 'user'
},
{
    _id: new mongoose.Types.ObjectId('66301a1f4d4b4a001a234b22'),
    username: "Juan López",
    email: "juan@example.com",
    password: "$2b$10$EjemploHashSeguro456"
},
{
    _id: new mongoose.Types.ObjectId('66301a1f4d4b4a001a234b33'),
    username: "Ana Martínez",
    email: "ana@example.com",
    password: "$2b$10$EjemploHashSeguro789"
}
];

const books = [
{
    _id: new mongoose.Types.ObjectId('88301a1f4d4b4a001a235c11'),
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    category: "Realismo mágico",
    condition: "Buen estado",
    owner: users[0]._id,
    image: "https://example.com/images/cien-anos.jpg",
    isAvailable: true,
    createdAt: new Date("2024-03-01")
},
{
    _id: new mongoose.Types.ObjectId('88301a1f4d4b4a001a235c22'),
    title: "El Quijote",
    author: "Miguel de Cervantes",
    category: "Clásicos",
    condition: "Algunas páginas subrayadas",
    owner: users[1]._id,
    image: "https://example.com/images/quijote.jpg",
    isAvailable: false,
    createdAt: new Date("2024-03-05")
},
{
    _id: new mongoose.Types.ObjectId('88301a1f4d4b4a001a235c33'),
    title: "La sombra del viento",
    author: "Carlos Ruiz Zafón",
    category: "Misterio",
    condition: "Como nuevo",
    owner: users[0]._id,
    image: "https://example.com/images/sombra-viento.jpg",
    isAvailable: true,
    createdAt: new Date("2024-03-10")
},
{
    _id: new mongoose.Types.ObjectId('88301a1f4d4b4a001a235c44'),
    title: "Harry Potter y la piedra filosofal",
    author: "J.K. Rowling",
    category: "Fantasía",
    condition: "Tapa desgastada",
    owner: users[2]._id,
    image: "https://example.com/images/harry-potter.jpg",
    isAvailable: true,
    createdAt: new Date("2024-03-12")
}
];

const loans = [
    {
    _id: new mongoose.Types.ObjectId('aa301a1f4d4b4a001a236d11'),
    book: books[0]._id,
    borrower: users[1]._id,
    owner: users[0]._id,
    requestDate: new Date("2024-03-15"),
    status: "pending"
},
{
    _id: new mongoose.Types.ObjectId('aa301a1f4d4b4a001a236d22'),
    book: books[1]._id,
    borrower: users[2]._id,
    owner: users[1]._id,
    requestDate: new Date("2024-03-10"),
    approvalDate: new Date("2024-03-11"),
    returnDate: new Date("2024-03-18"),
    status: "returned"
},
{
    _id: new mongoose.Types.ObjectId('aa301a1f4d4b4a001a236d33'),
    book: books[3]._id,
    borrower: users[0]._id,
    owner: users[2]._id,
    requestDate: new Date("2024-03-14"),
    approvalDate: new Date("2024-03-14"),
    status: "approved"
}
];

// Función principal
async function setupDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("No se encontró MONGO_URI en el archivo .env");

    console.log('⏳ Conectando a MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Conexión establecida.');

    // Limpiar base de datos anterior
    console.log('🗑️  Limpiando base de datos...');
    await mongoose.connection.db.dropDatabase();

    // Insertar nuevos datos
    console.log('🌱 Poblando base de datos...');
    await User.insertMany(users);
    await Book.insertMany(books);
    await Loan.insertMany(loans);
    console.log('Documentos insertados correctamente');

    console.log('🚀 Base de datos lista para pruebas!');
  } catch (error) {
    console.error('❌ Error en el setup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada.');
    process.exit();
  }
}

setupDatabase();