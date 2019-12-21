import WalletNotFoundError from '../error/WalletNotFoundError';
import NotEnoughBalanceError from '../error/NotEnoughBalanceError';

/**
 * Represent service of resources wallets
 */
class WalletService {
  constructor(models) {
    this._models = models;
  }

  async addWalletForUser(userId) {
    const { Wallet } = this._models;
    const newWallet = await Wallet.addWallet(userId);
    return newWallet;
  }

  async findWalletByUserId(userId) {
    const { Wallet } = this._models;
    const wallet = await Wallet.findByUserId(userId);
    if (!wallet) {
      throw new WalletNotFoundError();
    }
    return wallet;
  }

  async updateBalanceByUserId(userId, type, nominal) {
    const wallet = await this.findWalletByUserId(userId);
    if (!wallet) {
      throw new WalletNotFoundError();
    }
    const withdraw = 'withdraw';
    let multiplication = 1;
    if (type === withdraw) {
      multiplication = -1;
    }
    const nominalToUpdate = nominal * multiplication;
    if ((wallet.balance + nominalToUpdate) < 0) {
      throw new NotEnoughBalanceError();
    }
    const result = await wallet.updateBalance(nominalToUpdate);
    return result;
  }
}

export default WalletService;
