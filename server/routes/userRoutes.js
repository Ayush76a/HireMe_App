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
  oneTapLogin,
} = require("../controllers/userControllers");



router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-signup", googleRegister);
router.post("/google-login", oneTapLogin);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);


module.exports = router;
