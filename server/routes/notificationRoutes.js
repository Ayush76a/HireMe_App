const express = require('express');
const router = express.Router();
const protect = require("../middleWare/authMiddleware");

const {
  getNotifications,
} = require("../controllers/notificationControllers");


router.get("/notifications", protect, getNotifications);


module.exports = router;