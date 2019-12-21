import * as express from 'express';
import { validationRequest } from '../middleware/validationRequest';
import { userRequest } from './userRequestSchemes';
import withHandleError from '../middleware/withHandleError';
import authenticate from '../middleware/authenticate';

/**
 * Represent the end-point of User
 */
class UserController {
  constructor(app) {
    this._app = app;
    this._router = express.Router();
    this._services = this._app.locals.services;
    this._postUsers = this._postUsers.bind(this);
    this._getUserById = this._getUserById.bind(this);
    this._putUserById = this._putUserById.bind(this);
    this._getUserByCashtag = this._getUserByCashtag.bind(this);
  }

  registerRouter() {
    this._app.use('/users', this._router);
    this._router.post(
      '/',

      authenticate,
      validationRequest(userRequest.postSchema, 'body'), this._postUsers
    );
    this._router.get(
      '/:id',
      authenticate, validationRequest(userRequest.getAndPutSchemaParams, 'params'), withHandleError(this._getUserById)
    );
    this._router.put(
      '/:id',
      authenticate, validationRequest(userRequest.getAndPutSchemaParams, 'params'), validationRequest(userRequest.putSchemaBody, 'body'), withHandleError(this._putUserById)
    );
    this._router.get('/', authenticate, validationRequest(userRequest.getCashtagSchema, 'query'), withHandleError(this._getUserByCashtag));
  }

  async _postUsers(req, res) {
    const { userService } = this._services;
    const result = await userService.createUser(req.body);
    return res.status(201).json(result);
  }

  async _getUserById(req, res) {
    const { id } = req.params;
    const { userService } = this._services;
    const user = await userService.findUserById(id);
    return res.json(user);
  }

  async _putUserById(req, res) {
    const { id } = req.params;
    const { userService } = this._services;
    const params = Object.keys(req.body);
    const updateValues = {};
    params.forEach((param) => {
      updateValues[param] = req.body[param];
    });

    const updatedUser = await userService.updateUserById(id, updateValues);
    return res.status(201).json(updatedUser);
  }

  async _getUserByCashtag(req, res) {
    const { cashtag } = req.query;
    const { userService } = this._services;
    const user = await userService.findUserByCashtag(cashtag);
    return res.json(user);
  }
}

export default UserController;
