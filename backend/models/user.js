const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
  userId: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  badge: { type: String, default: false} ,
  color: { type: String } ,
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  address: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
    mobileno: { type: String },
  },
});
const User = mongoose.model("User", UserSchema, "User");

module.exports = User;
