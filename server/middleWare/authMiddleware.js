const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log('within try')
    console.log('tokem : ', token)

   
    if (!token || token==undefined) {
      return res.status(401).json({ message: "Not authorized 1, please login" });
    }

    console.log('within try 2')
   
    
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log(verified)
    // Get user id from token
    const user = await User.findOne({email : verified.email}).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User  not found" });
    }
    
    req.user = user;
    next();
  } 
  
  catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized 2, please login" });
  }
});

module.exports = protect;