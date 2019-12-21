import Joi from '@hapi/joi';

module.exports = {
  userRequest: {
    postSchema: Joi.object().keys({
      name: Joi.string().required(),
      address: Joi.string().required(),
      cashtag: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required()
    }),
    putSchemaBody: Joi.object().keys({
      name: Joi.string(),
      address: Joi.string(),
      phoneNumber: Joi.string(),
      email: Joi.string(),
      password: Joi.string()
    }),
    getAndPutSchemaParams: Joi.object().keys({
      id: Joi.number().integer().positive().min(1)
        .required()
    }),
    getCashtagSchema: Joi.object().keys({
      cashtag: Joi.string().required()
    })
  }
};
