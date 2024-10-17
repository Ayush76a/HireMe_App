const mongoose = require('mongoose');
const crypto = require('crypto');

// Function to generate a unique transaction reference ID
function generateTransactionRefId() {
  return crypto.randomBytes(12).toString('hex');  // 12-byte hex string for uniqueness
}

const transactionSchema = new mongoose.Schema({
  transaction_ref_id: {
    type: String,
    required: true,
    unique: true,
    default: generateTransactionRefId,  // Automatically generate the reference ID
  },
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user_email: {
    type: String,  // Email of the user (hirer)
    required: true,
  },
  helper_email: {
    type: String,  // Email of the helper
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,   // 'pending', 'completed', 'failed'
    required: true,
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
