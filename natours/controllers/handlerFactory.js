const AppError = require('../utility/appError');
const APIFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findById(req.params.id).populate(popOptions);

    if (!document) {
      return next(new AppError('Cant find document with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!document) {
      return next(new AppError('No document exist with the ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError('No document exist with the ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
