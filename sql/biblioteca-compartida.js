const mongoose = require('../client/node_modules/mongoose');

// URL de conexión a MongoDB local
const uri = 'mongodb://127.0.0.1:27017/biblioteca-compartida';

console.log("Iniciando script...");

// Definir el esquema y el modelo
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

// Conectar a la base de datos
async function conectarYInsertar() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión exitosa');
        // Eliminar BD
        await mongoose.connection.db.dropDatabase();
        console.log('🗑️  Base de datos eliminada');
        // Cerrar conexión
        await mongoose.connection.close();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log('🔌 Conexión cerrada');
        await insertarDocumentos();
        console.log("Base de datos creada y poblada.");
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Inserta los documentos
async function insertarDocumentos() {
    try {
        console.log('Insertando documentos...');
        // Crear colecciones y documentos
        // users es la colección (tabla) y sus documentos (los 3 objetos que contiene) son los registros
        const users = [
            {
                _id: new mongoose.Types.ObjectId('66301a1f4d4b4a001a234b10'),
                username: "admin",
                email: "frangoro@gmail.com",
                password: "chnageme",
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
        // Inserta los documentos
        await User.insertMany(users);
        await Book.insertMany(books);
        await Loan.insertMany(loans);
        console.log('Documentos insertados correctamente');
    } catch (err) {
        console.error('Error al insertar documentos:', err);
    }
}

conectarYInsertar();