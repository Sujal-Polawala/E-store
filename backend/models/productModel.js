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
  badge: String,
  rating: {
    rate: Number,
    count: Number,
  },
});

const Product = mongoose.model("Product", productSchema,"Product");

module.exports = Product;