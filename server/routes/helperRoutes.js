const express = require("express");
const router = express.Router();
// auth Middleware
const protect = require("../middleWare/authMiddleware");

const {
 getHelpers,
 contactHelper,
 jobApproval,
 jobDecline
} = require("../controllers/helperControllers");


router.get("/gethelpers", protect, getHelpers);
router.post('/contactHelper/:helperId', protect, contactHelper);

router.get('/respondJob/approve', jobApproval);   // Remove jobId and accept only email as a query parameter
router.get('/respondJob/decline', jobDecline);    // Remove jobId and accept only email as a query parameter

module.exports = router;