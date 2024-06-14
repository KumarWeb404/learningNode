const mongoose = require('mongoose');

const reviewModel = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty.']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'Review must belong to a tour.']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewModel.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

const Review = mongoose.model('review', reviewModel);

module.exports = Review;
