// /controllers/productController.js

const Product = require('../../models/productModel');
const productsData = require('../../data/productsData'); // Importing the sample product data
const mongoose = require('mongoose');

// Function to insert multiple products
const insertProducts = async (req, res) => {
  try {
    await Product.insertMany(productsData);  // Insert the sample data
    res.status(201).json({ message: 'Products inserted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error inserting products', error: err.message });
  }
};

// Fetch all products
const getAllProduct = async (req, res) => {
  const { category } = req.params;

  try {
    // Fetch products based on the category
    const products = await Product.find({ category: category });

    // Return the products as a response
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
}
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // console.log(products); // Log the data to see if the response is correct
    res.json(products);
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const fetchProductById = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from the URL
    console.log("Received ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ID format");
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const product = await Product.findOne({ _id: id }); // Query using ObjectId
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ error: "Product not found." });
    }

    console.log("Product fetched:", product);
    res.status(200).json(product); // Return the product in JSON format
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Export functions
module.exports = {
  insertProducts,
  getAllProduct,
  getAllProducts,
  fetchProductById
};
