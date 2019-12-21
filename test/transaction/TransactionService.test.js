import WalletService from '../../src/wallet/WalletService';
import TransactionService from '../../src/transaction/TransactionService';

describe('TransactionService', () => {
  let models;
  let walletService;
  let transactionService;
  let mockedWallet;
  let mockedTransaction;
  beforeEach(() => {
    models = {
      Wallet: {
        findByUserId: jest.fn()
      },
      Transaction: {
        addTransaction: jest.fn(),
        findByWalletId: jest.fn()
      }
    };
    walletService = new WalletService(models);
    walletService.updateBalanceByUserId = jest.fn();
    walletService.findWalletByUserId = jest.fn();
    transactionService = new TransactionService(models);
    mockedWallet = {
      id: 1,
      userId: 1,
      balance: 0,
      updateBalance: jest.fn()
    };
    mockedTransaction = {
      id: 1,
      walletId: 1,
      type: 'deposit',
      nominal: 1000
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#createTransaction', () => {
    it('should create new transaction to userId, and change the balance of the wallet depend on the transaction', async () => {
      const updatedMockWallet = {
        id: 1,
        userId: 1,
        balance: 1000
      };
      const dataTransaction = {
        userId: mockedWallet.userId,
        type: 'deposit',
        nominal: 1000,
        description: 'test'
      };
      walletService.findWalletByUserId.mockResolvedValue(mockedWallet);
      models.Wallet.findByUserId.mockResolvedValue(mockedWallet);
      mockedWallet.updateBalance.mockResolvedValue(updatedMockWallet);
      models.Transaction.addTransaction.mockResolvedValue(mockedTransaction);
      walletService.updateBalanceByUserId.mockResolvedValue(updatedMockWallet);

      const result = await transactionService.createTransaction(dataTransaction);

      expect(result).toMatchObject(mockedTransaction);
    });
  });

  describe('#findTransactionsByWalletId', () => {
    it('should call the fidByWalletId function with walletId and limit params then return list of transactions of a wallet', async () => {
      const secondTransaction = {
        id: 1,
        walletId: 1,
        type: 'withdraw',
        nominal: 100
      };
      models.Wallet.findByUserId.mockResolvedValue(mockedWallet);
      models.Transaction.findByWalletId.mockResolvedValue([mockedTransaction, secondTransaction]);

      const result = await transactionService.findTransactionByUserId(mockedWallet.userId, 2);

      expect(models.Transaction.findByWalletId).toHaveBeenCalledWith(secondTransaction.walletId, 2);
      expect(result).toContainEqual(mockedTransaction);
    });
  });
});
