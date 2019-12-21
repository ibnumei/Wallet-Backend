import Joi from '@hapi/joi';

module.exports = {
  transactionRequest: {
    postSchema: Joi.object().keys({
      nominal: Joi.number().required(),
      description: Joi.string().required(),
      beneficiaryId: Joi.number(),
      type: Joi.string().valid('withdraw', 'deposit').required()
    }),
    paramsSchema: Joi.object().keys({
      userId: Joi.number().integer().positive().min(1)
        .required(),
      walletId: Joi.number().integer().positive().min(1)
        .required()
    }),
    queryString: Joi.object().keys({
      limit: Joi.string()
    })
  }
};
