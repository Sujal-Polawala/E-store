const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Seller = require("../../models/seller"); // Import Seller model

// Seller registration route
exports.register = async (req, res) => {
  const { username, password, email, name } = req.body;

  try {
    // Check if seller already exists
    const sellerExists = await Seller.findOne({ username });
    if (sellerExists) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new seller
    const newSeller = new Seller({
      username,
      password: hashedPassword,
      email,
      name,
    });

    newSeller.sellerId = newSeller._id.toString();

    const savedSeller = await newSeller.save();
    console.log(savedSeller);

    res.status(201).json({ message: "Seller registered successfully. Awaiting admin approval." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Seller login route
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find seller by username
    const seller = await Seller.findOne({ username });
    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (seller.status === "rejected") {
      return res.status(403).json({ message: "Your request has been rejected. Please contact support." });
    }

    // Check if the seller is approved
    if (seller.status !== "approved") {
      return res.status(403).json({ message: "Your request is still pending approval or has been rejected." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ sellerId: seller._id }, "secret", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token,
      sellerId: seller._id,
     });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
