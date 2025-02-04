const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  name: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  sellerId: { type: String },
});

const Seller = mongoose.model("Seller", sellerSchema, "Seller");

module.exports = Seller;