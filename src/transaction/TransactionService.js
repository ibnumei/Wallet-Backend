import WalletService from '../wallet/WalletService';

/**
 * Represent the business logic of the transaction end point
 */
export default class TransactionService {
  constructor(models) {
    this._models = models;
  }

  async createTransaction({
    userId, nominal, type, description, beneficiaryId
  }) {
    const walletService = new WalletService(this._models);
    try {
      const updatedWallet = await walletService.updateBalanceByUserId(userId, type, nominal);
      const transactionData = {
        walletId: updatedWallet.id,
        nominal,
        type,
        description,
        beneficiaryId
      };
      const newTransaction = await this._addTransaction(transactionData, walletService);
      return newTransaction;
    } catch (e) {
      throw e;
    }
  }

  async _addTransaction(transactionData, walletService) {
    const { Transaction } = this._models;
    const newTransaction = await Transaction.addTransaction(transactionData);
    if (transactionData.type === TransactionService.TYPES.WITHDRAW
      && transactionData.beneficiaryId) {
      this._addTransactionToPayee(transactionData, walletService);
    }
    return newTransaction;
  }

  async _addTransactionToPayee(transactionData) {
    const {
      nominal, description, beneficiaryId
    } = transactionData;
    const transactionDataPayee = {
      userId: beneficiaryId,
      nominal,
      type: TransactionService.TYPES.DEPOSIT,
      description
    };
    await this.createTransaction(transactionDataPayee);
  }

  async findTransactionByUserId(userId, limit) {
    const { Transaction, Wallet } = this._models;
    const wallet = await Wallet.findByUserId(userId);
    const transactions = Transaction.findByWalletId(wallet.id, limit);
    return transactions;
  }
}

TransactionService.TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw'
};
