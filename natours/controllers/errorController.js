const AppError = require('../utility/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value "${value}". Please use another value.`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid Token! Try Again', 401);
const handleJWTExpiredError = () =>
  new AppError('Token Expired! Login again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 🧨', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong....',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV == 'production') {
    let error = { ...err };

    if (error.name == 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code == 11000) {
      error = handleDuplicateDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, res);
  }
};
