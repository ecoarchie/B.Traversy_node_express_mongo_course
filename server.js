const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to db
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body parser
app.use(express.json());

// app.use(logger); // just an example of my own custom logger. Going to use mogran instead

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// In order to user error middleware, we have to put it below controllers
app.use(errorHandler);

const PORT = process.env.PORT || 5500;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server and exit process
  server.close(() => process.exit(1));
});
