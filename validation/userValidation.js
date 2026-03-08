const joi = require("joi");

const UserValidation = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required()
});

module.exports = UserValidation;