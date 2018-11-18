const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.iLength(data.text , {min:10 , max: 300})) {
    errors.text = " Text must be between 10 and 300 characters "
  }

  if (!Validator.isEmail(data.text)) {
    errors.text = 'Text is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};