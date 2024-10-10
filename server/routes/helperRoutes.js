const express = require("express");
const router = express.Router();
// auth Middleware
const protect = require("../middleWare/authMiddleware");

const {
 getHelpers,
 contactHelper
} = require("../controllers/helperControllers");


router.get("/gethelpers", protect, getHelpers);
router.post('/contactHelper/:helperId', protect, contactHelper);

module.exports = router;