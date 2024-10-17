const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  helperEmail: {
    type: String,
    required: true,
  },
  helperName: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  taskStatus: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',  // Default to 'pending' until the task is approved/declined
  },
  status: {
    type: String,
    default: 'unread',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
