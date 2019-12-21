import Joi from '@hapi/joi';

module.exports = {
  authenticationSchemes: {
    postSchema: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required()
    })
  }
};
