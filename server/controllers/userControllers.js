const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Cookies = require('universal-cookie');

const cookies = new Cookies();

// Generate Token
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};



// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password} = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });
  
  //   Generate Token
  const token = generateToken(user.email);


  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});



// Signup with Google
const googleRegister = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
// The method ticket.getPayload() returns the decoded payload of the Google ID token,
//  which contains important user information. This payload typically includes the user's:
//  name, email, picture
    const { name, email } = ticket.getPayload();

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // If user already exists, check if they signed up via Google
      if (!user.isGoogleUser) {
        return res.status(400).json({ message: 'User already exists with a different signup method.' });
      }

      // User exists and signed up via Google, proceed to login or update profile
      const token = generateToken(email);
      
      // SET THE COOKIE
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    }
    else{
    // Create a new user with Google credentials
    user = new User({
      name,
      email,
      isGoogleUser: true, // Mark this user as Google-based
      // No password for Google users
    });

    // Generate JWT token for the new user
    const newToken = generateToken(email)
    
    console.log("reacehd !!")
    
    // Save user to database
    await user.save();
    
    // send cookie
    res.cookie("token", newToken, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    console.log("reacehd !! bhefoge save")


    console.log("token from backend :", newToken);

    // Send response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: newToken,
    });
  }
  } catch (error) {
    console.error('Error during Google signup:', error);
    res.status(400).json({ message: 'Invalid Google token or signup failed.' });
  }
};



// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user.email);

  
  if(passwordIsCorrect){

   // Send HTTP-only cookie
    // cookies.set("token", token, {
    //   expires: new Date(Date.now() + 1000 * 3600)
    // });
    
   res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });
}
  if (user && passwordIsCorrect) {
    const { name, email, role, phone, bio } = user;
    res.status(200).json({
      name,
      email,
      role,
      phone,
      bio,
      token
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});


// Logout User
const logout = asyncHandler(async (req, res) => {
  
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});



// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({email : req.user.email});
  console.log(user)

  if (user) {
    const {name, email, role, phone, bio } = user;
    res.status(200).json({
      name,
      email,
      role,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});


// Reset password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  //Validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successful");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});


const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Reste Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hash token before saving to DB
  //sha256 is encryption method
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
  }).save();


  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
      <h2>Hello ${user.name}</h2>
      <p>Please use the url below to reset your password</p>  
      <p>This reset link is valid for only 30minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards...</p>
      <p>Pinvent Team</p>
    `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});


// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // fIND tOKEN in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});



// Contact the user 



module.exports = {
  registerUser,
  loginUser,
  logout,
  googleRegister,
  getUser,
};
