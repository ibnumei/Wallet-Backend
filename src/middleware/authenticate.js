import jwt from 'jsonwebtoken';

import createError from 'http-errors';
import config from '../../config';

const AUTH_HEADER = 'Authorization';

const authenticate = async (req, res, next) => {
  try {
    const authToken = req.get(AUTH_HEADER);
    const decodedToken = jwt.verify(authToken, config.secret);
    if (decodedToken.user) {
      req.user = decodedToken.user;
      return next();
    }
    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.Unauthorized());
  }
};

module.exports = authenticate;
