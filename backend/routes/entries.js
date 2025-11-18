const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/entryController');

// Validation rules for entry creation
const entryValidationRules = [
  body('water')
    .exists().withMessage('Water is required')
    .isNumeric().withMessage('Water must be a number')
    .custom(value => value >= 0).withMessage('Water cannot be negative'),
  body('exercise')
    .exists().withMessage('Exercise is required')
    .isNumeric().withMessage('Exercise must be a number')
    .custom(value => value >= 0).withMessage('Exercise cannot be negative'),
  body('sugar')
    .exists().withMessage('Blood sugar is required')
    .isNumeric().withMessage('Blood sugar must be a number')
    .custom(value => value >= 0).withMessage('Blood sugar cannot be negative'),
];

router.post('/', entryValidationRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, controller.createEntry);

router.get('/', controller.getEntries);

module.exports = router;
