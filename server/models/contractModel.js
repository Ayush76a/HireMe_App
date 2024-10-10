const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const contractSchema = new Schema({
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    hirer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    helper: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentDetails: {
      agreedAmount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
      },
      method: {
        type: String, // e.g., 'stripe', 'paypal', etc.
      },
    },
    contractStatus: {
      type: String,
      enum: ['open', 'completed', 'disputed', 'canceled'],
      default: 'open',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  }, { timestamps: true });
 
  const Contract = mongoose.model('Contract', contractSchema);
  
  module.exports = Contract
  