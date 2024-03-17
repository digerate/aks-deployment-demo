require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./APIDoc/swagger');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = process.env.PORT || 3000;

// Conditional database setup
if (process.env.USE_COSMOS_DB === 'true') {
  // Cosmos DB setup
  const { CosmosClient } = require("@azure/cosmos");
  const client = new CosmosClient({
    endpoint: process.env.COSMOS_DB_URI,
    key: process.env.COSMOS_DB_PRIMARY_KEY,
  });
  const database = client.database(process.env.COSMOS_DB_DATABASE_ID);
  const container = database.container(process.env.COSMOS_DB_CONTAINER_ID);
  // Additional Cosmos DB setup or logic here
  console.log('Connected to Azure Cosmos DB...');
} else {
  // MongoDB setup
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
}

// Serve Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Enhanced Node.js App!');
});

// User-related routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Check if this is a validation error or any specific error you want to report to the user
  if (err.isOperational) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // For other types of errors, you might not want to leak details
  res.status(500).send('An unexpected error occurred. Please try again later.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
