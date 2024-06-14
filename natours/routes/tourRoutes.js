const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  next();
});

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'tour-lead'),
    tourController.deleteTour
  );

module.exports = router;
