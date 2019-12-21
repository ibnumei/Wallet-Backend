import jwt from 'jsonwebtoken';
import forge from 'node-forge';
import withHandleError from '../middleware/withHandleError';
import config from '../../config';
import UserNotFoundError from '../error/UserNotFoundError';
import { validationRequest } from '../middleware/validationRequest';
import { authenticationSchemes } from './authenticationSchemes';

/**
 * Represent the end-point of authentication user
 */
class AuthenticationController {
  constructor(app) {
    this._app = app;
    this._service = this._app.locals.services;
    this._postLogin = this._postLogin.bind(this);
  }

  registerRouter() {
    this._app.post(
      '/login',
      validationRequest(authenticationSchemes.postSchema, 'body'),
      withHandleError(this._postLogin)
    );
  }

  async _postLogin(req, res, next) {
    const { email, password } = req.body;
    const { userService } = this._service;

    try {
      const sha = forge.md.sha1.create();
      sha.update(password);
      const hashedPassword = sha.digest().toHex();

      const user = await userService.findUserByPasswordEmail(email, hashedPassword, { expiresIn: '2 days' });

      if (user) {
        const payload = { user };
        const token = jwt.sign(payload, config.secret);
        return res.json({ token });
      }

      return next(new UserNotFoundError());
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthenticationController;
