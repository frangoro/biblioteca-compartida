const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    condition: String, // estado del libro
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: String,
    isAvailable: Boolean,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
