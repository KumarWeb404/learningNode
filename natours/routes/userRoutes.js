const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/').get(userController.getAllUsers);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser);

module.exports = router;
