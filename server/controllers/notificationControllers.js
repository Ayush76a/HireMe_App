const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel'); // Import Notification model
const User = require('../models/userModel'); // Assuming you have a user model

const getNotifications = async (req, res) => {
  try {
    // Ensure the user is logged in and the user's email is available from the `protect` middleware
    const userEmail = req.user.email; // Get the logged-in user's email from `req.user`

    if (!userEmail) {
      return res.status(401).json({ message: 'Not authorized, please log in.' });
    }

    // Fetch only the notifications that belong to the logged-in user
    const notifications = await Notification.find({ userEmail }).sort({ createdAt: -1 });

    console.log('Fetched Notifications for user:', userEmail, notifications);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications.');
  }
};
module.exports = {
    getNotifications,
}
