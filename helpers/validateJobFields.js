const { body } = require('express-validator');

module.exports = () => {
  return [
    body('company')
      .trim()
      .notEmpty()
      .withMessage('company must not be empty')
      .isLength({ max: 50 })
      .withMessage('company cannot exceed 50 characters'),
    body('position')
      .trim()
      .notEmpty()
      .withMessage('position must not be empty')
      .isLength({ max: 100 })
      .withMessage('position cannot exceed 100 characters'),
  ];
};
