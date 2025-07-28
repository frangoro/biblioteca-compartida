const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
