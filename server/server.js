const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const helperRoutes = require("./routes/helperRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// payment gateway
const {cashfree, Cashfree} = require("cashfree-pg")



const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  credentials: true,
}));



// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


// userRoutes with path prefix
app.use(userRoutes);
app.use(helperRoutes);
app.use(notificationRoutes);
app.use(paymentRoutes);
app.use(transactionRoutes);



// CashFree Payment Integration 
// SETTING UP CASHFREE GATEWAY
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret= process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;     // sandBox => Testing



// Connect to DB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
