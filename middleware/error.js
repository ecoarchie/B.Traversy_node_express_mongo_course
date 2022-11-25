const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for developer
  console.log(err.stack);

  // Mongoose bad object ID
  if (err.name === 'CastError') {
    const message = `Resourse not found with ID of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Validation error
  if (err.name === 'ValidationError') {
    console.log(Object.values(err.errors));
    const message = Object.values(err.errors).map((val) => val.message);
    // const message = err.errors.properties;

    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  });
};

module.exports = errorHandler;
