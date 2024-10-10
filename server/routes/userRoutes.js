const express = require("express");
const router = express.Router();
// auth Middleware
const protect = require("../middleWare/authMiddleware");

const {
  registerUser,
  loginUser,
  logout,
  googleRegister,
  getUser,
  braintreePayment,
  braintreeTokenController
} = require("../controllers/userControllers");



router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-register", googleRegister);
router.get("/logout", protect, logout);
router.get("/getuser", protect, getUser);


module.exports = router;
