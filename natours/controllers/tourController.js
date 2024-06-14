const Tour = require('./../models/tourModel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const handlerFactory = require('../controllers/handlerFactory');

exports.getAllTours = handlerFactory.getAll(Tour);
// try {
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: err,
//   });
// }
// const queryObj = { ...req.query };
// const excludedFields = ['page', 'limit', 'sort', 'field'];
// excludedFields.forEach((el) => delete queryObj[el]);

// let queryString = JSON.stringify(queryObj);
// queryString = queryString.replace(
//   /\b(gte|gt|lt|lte)\b/g,
//   (match) => `$${match}`
// );

// let query = Tour.find(JSON.parse(queryString));

// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

// if (req.query.field) {
//   const field = req.query.field.split(',').join(' ');
//   query = query.select(field);
// } else {
//   query = query.select('-__v');
// }

//   const features = new APIFeatures(Tour.find, req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tours,
//     },
//   });

exports.createTour = handlerFactory.createOne(Tour);

exports.getTour = handlerFactory.getOne(Tour, { path: 'reviews' });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.updateTour = handlerFactory.updateOne(Tour);

exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTours: -1 }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
