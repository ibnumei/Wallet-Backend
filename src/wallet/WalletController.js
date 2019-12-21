import { validationRequest } from '../middleware/validationRequest';
import { walletRequest } from '../wallet/walletRequestSchemes';
import withHandleError from '../middleware/withHandleError';
import authenticate from '../middleware/authenticate';

/**
 * Represent the end-point of wallet
 */
class WalletController {
  constructor(app) {
    this._app = app;
    this._services = this._app.locals.services;
    this._getWalletById = this._getWalletById.bind(this);
  }

  registerRouter() {
    this._app.get(
      '/users/:userId/wallets',
      authenticate, validationRequest(walletRequest.getAndPutSchema, 'params'), withHandleError(this._getWalletById)
    );
  }

  async _getWalletById(req, res) {
    const { userId } = req.params;
    const { walletService } = this._services;
    const wallet = await walletService.findWalletByUserId(userId);
    return res.json(wallet);
  }
}

export default WalletController;
