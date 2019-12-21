import { validationRequest } from '../middleware/validationRequest';
import { transactionRequest } from '../transaction/transactionRequestSchemes';
import withHandleError from '../middleware/withHandleError';
import authenticate from '../middleware/authenticate';

/**
 * Represent the end-point of transaction
 */
class TransactionController {
  constructor(app) {
    this._app = app;
    this._service = this._app.locals.services;
    this._postTransaction = this._postTransaction.bind(this);
    this._getTransaction = this._getTransaction.bind(this);
  }

  registerRouter() {
    this._app.post(
      '/users/:userId/wallets/:walletId/transactions',
      authenticate,
      validationRequest(transactionRequest.paramsSchema, 'params'),
      validationRequest(transactionRequest.postSchema, 'body'),
      withHandleError(this._postTransaction)
    );
    this._app.get(
      '/users/:userId/wallets/:walletId/transactions',
      authenticate,
      validationRequest(transactionRequest.paramsSchema, 'params'),
      validationRequest(transactionRequest.queryString, 'query'),
      withHandleError(this._getTransaction)
    );
  }

  async _postTransaction(req, res) {
    const { userId } = req.params;
    const {
      type, nominal, description, beneficiaryId
    } = req.body;
    const { transactionService } = this._service;
    const dataTransaction = {
      userId,
      type,
      nominal,
      description,
      beneficiaryId
    };
    const result = await transactionService.createTransaction(dataTransaction);
    return res.status(201).json(result);
  }

  async _getTransaction(req, res) {
    const { userId } = req.params;
    const { limit } = req.query;
    const { transactionService } = this._service;
    const result = await transactionService.findTransactionByUserId(userId, limit);
    return res.status(200).json(result);
  }
}

export default TransactionController;
