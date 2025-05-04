const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');
const repaymentRoutes = require('./routes/repaymentRoutes');

// Load env vars
require('dotenv').config();

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/repayments', repaymentRoutes);

// Error handling middleware
app.use(errorHandler);

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Models synchronized...');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;