const mongoose = require('mongoose');

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

module.exports = mongoose.model('Loan', loanSchema);
