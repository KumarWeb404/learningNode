const mongoose = require('mongoose');
const slugify = require('slugify');

const User = require('../models/userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group.']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can only be: easy, medium, difficult.'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'Rating must be more than 1.0'],
      max: [5.0, 'Rating must be less than 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary.']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image.']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'user' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'tour',
  localField: '_id'
});

tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (el) => await User.findById(el));
  this.guides = await Promise.all(guidesPromises);
  next();
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
