// /controllers/productController.js

const Product = require("../../models/productModel");
const productsData = require("../../data/productsData"); // Importing the sample product data
const mongoose = require("mongoose");
const Category = require("../../models/category");
const Seller = require("../../models/seller");

const addProduct = async (req, res) => {
  try {
    const {
      sellerId,
      title,
      price,
      description,
      category,
      image,
      color,
      badge,
      quantity,
    } = req.body;

    if (!sellerId) {
      return res.status(400).send({ message: "Seller ID is required" });
    }

    // Find the last product to get the highest id
    const lastProduct = await Product.findOne().sort({ id: -1 });

    const newProduct = new Product({
      id: lastProduct ? lastProduct.id + 1 : 1, // Increment last id, or start at 1
      sellerId,
      title,
      price,
      description,
      category,
      image,
      color,
      badge,
      quantity,
    });

    // Save product to database
    await newProduct.save();

    // Update Seller's products array
    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { $push: { products: newProduct._id } }, // Push new product ID into seller's products array
      { new: true } // Return updated document
    );

    if (!updatedSeller) {
      return res.status(404).send({ message: "Seller not found" });
    }

    res.status(201).send(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ message: "Error adding product" });
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
    await Product.insertMany(productsData); // Insert the sample data
    res.status(201).json({ message: "Products inserted successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error inserting products", error: err.message });
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
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getFilters = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { sellerId, badge, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (sellerId) query.sellerId = sellerId; // Apply seller filter only if provided
    if (badge) query.badge = badge;
    if (category) query.category = category;
    if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    const products = await Product.find(query).populate("sellerId", "name");
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

    const product = await Product.findById(id); // Query using ObjectId
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ error: "Product not found." });
    }
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
  deleteProductById,
};
