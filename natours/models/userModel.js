const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userModel = mongoose.Schema({
  photo: String,
  name: {
    type: String,
    required: [true, 'User must have a name.']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'tour-guide', 'tour-lead', 'admin'],
      message: 'Invalid role!'
    }
  },
  email: {
    type: String,
    required: [true, 'User must have an email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email.']
  },
  password: {
    type: String,
    required: [true, 'User must have a password.'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match!'
    }
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true
  }
});
userModel.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userModel.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userModel.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

userModel.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userModel.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userModel.methods.resetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('user', userModel);

module.exports = User;
