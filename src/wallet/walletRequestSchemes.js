import Joi from '@hapi/joi';

module.exports = {
  walletRequest: {
    getAndPutSchema: Joi.object().keys({
      userId: Joi.number().integer().positive().min(1)
        .required()
    })
  }
};
