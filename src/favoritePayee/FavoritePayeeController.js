import { validationRequest } from '../middleware/validationRequest';
import { payeeRequest } from './favoritePayeeRequestScheme';
import withHandleError from '../middleware/withHandleError';
import authenticate from '../middleware/authenticate';

export default class FavoritePayeeController {
  constructor(app) {
    this._app = app;
    this._service = this._app.locals.services;
    this._postPayee = this._postPayee.bind(this);
    this._getPayees = this._getPayees.bind(this);
  }

  registerRouter() {
    this._app.post(
      '/users/:userId/favorite-payees',
      authenticate,
      validationRequest(payeeRequest.userParamsSchema, 'params'),
      withHandleError(this._postPayee)
    );
    this._app.get(
      '/users/:userId/favorite-payees',
      authenticate,
      validationRequest(payeeRequest.userParamsSchema, 'params'),
      withHandleError(this._getPayees)
    );
  }

  async _postPayee(req, res) {
    const { userId } = req.params;
    const { payeeId } = req.body;
    const { payeeService } = this._service;
    const dataPayee = {
      userId,
      payeeId
    };
    const result = await payeeService.addPayee(dataPayee);
    return res.status(201).json(result);
  }

  async _getPayees(req, res) {
    const { userId } = req.params;
    const { payeeService } = this._service;
    const result = await payeeService.findPayeesByUserId(userId);
    return res.status(200).json(result);
  }
}
