const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid emaial",
    ],
  },
  password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be up to 6 characters"],
      //   maxLength: [23, "Password must not be more than 23 characters"],
    },
  role: {
    type: String, // 'hirer' or 'helper'
    enum: ['hirer', 'helper'],
    default: 'helper',
  },
  bio: {
    type: String, // Optional short description of the user
    default: 'Tell me about your self'
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

//   Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});


const User = mongoose.model("User", userSchema);

module.exports = User
