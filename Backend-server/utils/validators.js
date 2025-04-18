const Joi = require('joi');

const chartSchema = Joi.object({
  name: Joi.string().required(),
  birthDate: Joi.date().required(),
  birthTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  birthPlace: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  notes: Joi.string().allow('', null),
});

module.exports = {
  chartSchema
};
