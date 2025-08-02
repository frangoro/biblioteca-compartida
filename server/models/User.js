const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// --- MIDDLEWARE PARA HASHEAR LA CONTRASEÑA ANTES DE GUARDAR ---
userSchema.pre('save', async function (next) {
  // `this` se refiere al documento que se está guardando
  
  // Si el campo de la contraseña NO ha sido modificado, no hagas nada.
  // Esto es crucial para no hashear la contraseña si solo se actualiza el email, por ejemplo.
  if (!this.isModified('password')) {
    next();
  }

  // Genera un "salt" (una cadena aleatoria) para añadir seguridad al hash
  const salt = await bcrypt.genSalt(10); // 10 es el costo, un valor recomendado
  
  // Hashea la contraseña con el salt
  this.password = await bcrypt.hash(this.password, salt);
  
  // Pasa al siguiente middleware (o a la operación de guardar en la DB)
  next();
});

// --- MÉTODO PARA VERIFICAR LA CONTRASEÑA ---
// También es buena práctica añadir un método para comparar contraseñas
// Esto se usará en tu controlador de login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
