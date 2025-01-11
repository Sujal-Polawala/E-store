const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');  // Import the connectDB function
const bodyParser = require('body-parser');
const routes = require('./routes/indexRoutes'); 

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB using connectDB function
connectDB();  // This will handle the MongoDB connection
// Serve static files from the 'assets' folder
// app.use(express.static(path.join(__dirname, 'assets', 'images')));

// Use product routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));