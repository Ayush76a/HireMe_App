const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const helperRoutes = require("./routes/helperRoutes");

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



// Routes
app.get("/", (req, res) => {
  res.send("Home Page for Hire Me");
});

// userRoutes with path prefix
app.use(userRoutes);
app.use(helperRoutes);


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
