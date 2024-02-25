const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  next();
});

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour);

module.exports = router;
