// // /models/productModel.js

// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema(
//   {
//     id: { type: Number, required: true},
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: String, required: true },
//     color: { type: String },
//     description: { type: String },
//     category: { type: String, enum: ['Mens Clothing', 'Womens Clothing', 'Watches', 'Jewelry', 'Accessories'], required: true },
//     // isNewArrival: { type: Boolean, default: false },
//     // isSpecialOffer: { type: Boolean, default: false },
//     // isBestSeller: { type: Boolean, default: false },
//     badge: { type: Boolean, default: false },
//     qty: { type: Number, required: true},
//   },
//   { timestamps: true }
// );

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;
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