const express = require("express");
const router = express.Router();
// auth Middleware
const protect = require("../middleWare/authMiddleware");

const {
  Pay,
  Verify
} = require("../controllers/paymentControllers");


router.post('/pay', protect, Pay);
router.post('/verify', Verify)

module.exports = router;
