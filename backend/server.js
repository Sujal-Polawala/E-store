const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');  // Import the connectDB function
const bodyParser = require('body-parser');
const routes = require('./routes/indexRoutes'); 
const { ApolloServer } = require('apollo-server-express');  // Apollo Server
const typeDefs = require('./graphql/schema');  // GraphQL schema
const resolvers = require('./graphql/resolvers');  // GraphQL resolvers

const app = express();

// Middlewares
app.use(cors());
app.use('/api/stripe-webhook', bodyParser.raw({ type: 'application/json' }));
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB using connectDB function
connectDB();  // This will handle the MongoDB connection

// Set up Apollo Server with GraphQL schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  // Wait for Apollo Server to start
  await server.start();

  // Apply Apollo Server middleware after it's started
  server.applyMiddleware({ app });

  // Use other routes
  app.use('/', routes);

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Start the server
startServer();
