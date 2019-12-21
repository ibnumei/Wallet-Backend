import Joi from '@hapi/joi';

module.exports = {
  payeeRequest: {
    postSchema: Joi.object().keys({
      cashtag: Joi.string().required()
    }),
    userParamsSchema: Joi.object().keys({
      userId: Joi.number().integer().positive().min(1)
        .required()
    })
  }
};
