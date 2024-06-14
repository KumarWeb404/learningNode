const User = require('../models/userModel');
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const handlerFactory = require('../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates', 400));
  }

  const filteredObj = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.body._id, filteredObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.body._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateUser = handlerFactory.updateOne(User);
