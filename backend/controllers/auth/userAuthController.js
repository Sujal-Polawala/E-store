const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send emails
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Our Platform Team" <${process.env.EMAIL_USER}>`, // Friendly name for the sender
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Register Controller
exports.register = async (req, res) => {
  const { username, password, confirmPassword, email, firstname, lastname } =
    req.body;

  try {
    if (
      !username ||
      !password ||
      !confirmPassword ||
      !email ||
      !firstname ||
      !lastname
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
    });
    const savedUser = await newUser.save();

    // Send email to verify account creation
    const emailSubject = "Welcome to Our Platform StyleVerse!";
    const emailContent = `
      <h1>Welcome, ${firstname} ${lastname}!</h1>
      <p>Your account has been successfully created with the following details:</p>
      <ul>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      <p>We're excited to have you onboard. You can now log in to your account and explore our platform.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The StyleVerse Team</p>
    `;
    await sendEmail(email, emailSubject, emailContent);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ 
        message: `Account locked. Try again in ${remainingTime} minutes.` 
      });
    }
    
    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;

      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();

        // Send reset password email
        // const resetLink = `http://localhost:3000/reset-password/${user._id}/${token}`;
        const emailSubject = "Account Locked";
        const emailText = `Hello ${user.firstname},\n\nYour account has been locked due to multiple failed login attempts.\nThanks,\nThe StyleVerse Team.`;
        sendEmail(user.email, emailSubject, emailText);

        return res.status(403).json({ message: "Account locked. We sent to your email." });
      }

      await user.save();
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Send email notification after successful login
    const emailSubject = "Successful Login Notification";
    const emailText = `Hello ${user.firstname} ${user.lastname},\n\nYou have successfully logged into your account.\nIf this wasn't you, please reset your password.\n\nThanks,\nThe StyleVerse Team.`;
    sendEmail(user.email, emailSubject, emailText);


    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Forgot Password Controller
exports.forgotPass = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a token with a 3-hour expiration
    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "3h" });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email with reset link
    
    const resetLink = `http://localhost:3000/reset-password/${user._id}/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetLink}" target="_self" rel="noreferrer noopener">${resetLink}</a>
    <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email Error:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      return res.status(200).json({ message: "Reset link sent successfully" });
    });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Controller
exports.resetPass = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token and check expiration
    const decoded = jwt.verify(token, "secret");

    // Check if the token matches the user's ID
    if (decoded.id !== id) {
      return res.status(401).json({ message: "Invalid token or user ID" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password in the database
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Successfully",
      html: `
        <p>Hello ${user.firstname+" "+user.lastname || "User"},</p>
        <p>Your password has been reset successfully. If you did not perform this action, please contact our support StyleVerse team immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset successfully and email sent." });
  } catch (error) {
    console.error("Error in resetPass:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Reset link expired. Please request a new one." });
    }

    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded.id).select(
      "-password -confirmPassword"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
