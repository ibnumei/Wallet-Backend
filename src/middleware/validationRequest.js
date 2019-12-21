import createError from 'http-errors';

const { BadRequest } = createError;
module.exports = {
  validationRequest: (schema, property) => async (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (error) {
      const errorBadRequest = new BadRequest(error.details[0].message);
      return next(errorBadRequest);
    }
    return next();
  }
};

