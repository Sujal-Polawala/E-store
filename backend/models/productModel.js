// // /models/productModel.js
const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number, // New sellPrice field
  description: String,
  category: String,
  image: String,
  color: String,
  badge: { // Include badge in schema with predefined values
    type: String,
    enum: ["Popular", "Top Rated", "Average", "Luxury", "Affordable", "Standard"],
    default: "Popular", // Default value
  },
  rating: {
    rate: Number,
    count: Number,
  },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" }, 
});

const Product = mongoose.model("Product", productSchema,"Product");

module.exports = Product;