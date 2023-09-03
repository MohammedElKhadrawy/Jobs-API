const express = require('express');
const { body } = require('express-validator');

const { register, login } = require('../controllers/auth');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Please provide a name between 3-50 characters')
      .trim()
      .isLength({ min: 3, max: 50 }),
    body('email', 'Please provide a valid E-mail')
      .trim()
      .isEmail()
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error('E-mail address already exists!'); // express-async-errors doesn't catch promise.reject
        }
      }),
    body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // min-length of 8 characters and at least one letter and one number!
      .withMessage('password must contain at least 1 letter and 1 number'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email', 'E-mail must not be empty!').trim().notEmpty(),
    body('password', 'Password must not be empty!').trim().notEmpty(),
  ],
  login
);

module.exports = router;
