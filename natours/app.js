const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limiter');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config.env' });

const AppError = require('./utility/appError');
const globalErrorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['duration']
  })
);
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests, Try again after an hour!'
// });

// app.use('/api', limiter);
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Cant find ${req.originalUrl} on this server!`);
  // err.status = 'error';
  // err.statusCode = 404;
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

module.exports = app;
