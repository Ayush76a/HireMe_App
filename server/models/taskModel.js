const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    duration: {
      type: String, // Time-based agreements, e.g., hourly, weekly, etc.
    },
    status: {
      type: String,
      enum: ['open', 'in progress', 'completed', 'canceled'],
      default: 'open',
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentNegotiated: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD',
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
      },
    },
  }, { timestamps: true });

  const Task = mongoose.model('Task', taskSchema);
  
  module.exports = Task 
  