// /controllers/productController.js

const Product = require('../../models/productModel');
const productsData = require('../../data/productsData'); // Importing the sample product data
const mongoose = require('mongoose');
const Category = require('../../models/category');

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update Product by Id

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating product", details: error.message });
  }
};

// Delete Product by Id

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};
// Get All Products

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

const getFilters = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching categories' });
      }
}

const getAllProducts = async (req, res) => {
  try {
    const { badge, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (badge) query.badge = badge;
    if (category) query.category = category;
    if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
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
  fetchProductById,
  getFilters, 
  addProduct,
  updateProductById,
  deleteProductById
};
