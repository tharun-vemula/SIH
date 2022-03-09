const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.'),
    body('password', 'Password has to be valid.')
      .isLength({ min: 6 })
      
  ],
authController.postLogin);

router.post('/signup', 
[
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with at least 6 characters.'
    )
      .isLength({ min: 6 }),
      body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match!');
      }
      return true;
    })
  ],authController.postSignup);

  router.get('/logout' , authController.logout);

  router.get('/profile', authController.getProfile );

  
module.exports = router;