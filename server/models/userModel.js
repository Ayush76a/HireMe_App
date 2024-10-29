const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser; // Only required if it's not a Google signup
    },
    minLength: [6, "Password must be at least 6 characters"],
  },
  isGoogleUser: {
    type: Boolean,
    default: false, // Set to true for users signing up via Google
  },
  role: {
    type: String, // 'hirer' or 'helper'
    enum: ['hirer', 'helper'],
    default: 'helper',
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // `sparse` allows this field to be unique but nullable
  },
  bio: {
    type: String, // Optional short description of the user
    default: 'Tell me about yourself',
  },
  rating: {
    type: Number, // Rating from other users, optional
    default: 0,
  },
  tasksCompleted: {
    type: Number, // Total tasks completed by the user
    default: 0,
  },
  hiredTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  tasksPosted: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
}, { timestamps: true });

// Encrypt password before saving to DB, only if it's not a Google signup
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isGoogleUser) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
