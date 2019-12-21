import WalletService from '../../src/wallet/WalletService';
import WalletNotFoundError from '../../src/error/WalletNotFoundError';
import NotEnoughBallanceError from '../../src/error/NotEnoughBalanceError';

describe('WalletService', () => {
  let models;
  let walletService;
  let mockedUser;
  let mockedWallet;
  beforeEach(() => {
    models = {
      Wallet: {
        addWallet: jest.fn(),
        findByUserId: jest.fn()
      }
    };
    walletService = new WalletService(models);
    mockedUser = {
      id: 1,
      name: 'alan',
      address: 'Pancoran selatan',
      phoneNumber: '087760118555'
    };
    mockedWallet = {
      id: 1,
      userId: mockedUser.id,
      balance: 0,
      updateBalance: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#addWaletForUserId', () => {
    it('should create new new wallet with the idUser and balance 0', async () => {
      models.Wallet.addWallet.mockResolvedValue(mockedWallet);

      const result = await walletService.addWalletForUser(mockedUser.id);

      expect(result).toEqual(mockedWallet);
    });
  });

  describe('#findWalletByUserId', () => {
    it('should get wallet by wallet id', async () => {
      models.Wallet.findByUserId.mockResolvedValue(mockedWallet);

      const result = await walletService.findWalletByUserId(mockedUser.id);

      expect(result).toEqual(mockedWallet);
    });

    it('should throw WalletNotFoundError Error when no wallet with that id', async () => {
      models.Wallet.findByUserId.mockResolvedValue();

      await expect(walletService.findWalletByUserId(mockedUser.id))
        .rejects.toEqual(new WalletNotFoundError());
    });
  });

  describe('#updateBalanceByUserId', () => {
    it('should update the balance of the wallet based on the type', async () => {
      walletService.findWalletByUserId = jest.fn();
      const expectedResult = {
        id: 1,
        userId: mockedUser.id,
        balance: 1000,
        updateBalance: jest.fn()
      };
      walletService.findWalletByUserId.mockResolvedValue(mockedWallet);
      mockedWallet.updateBalance.mockResolvedValue(expectedResult);

      const result = await walletService.updateBalanceByUserId(
        mockedUser.id,
        'deposit',
        1000
      );

      expect(result).toMatchObject(expectedResult);
    });

    it('should throw error wallet not found when the id is not available', async () => {
      walletService.findWalletByUserId = jest.fn();
      walletService.findWalletByUserId.mockResolvedValue();

      await expect(walletService.updateBalanceByUserId(
        1345,
        'deposit',
        1000
      )).rejects.toEqual(new WalletNotFoundError());
    });

    it('should throw error transaction when the initial balance is 0 and doing withdraw', async () => {
      walletService.findWalletByUserId = jest.fn();
      walletService.findWalletByUserId.mockResolvedValue(mockedWallet);

      await expect(walletService.updateBalanceByUserId(
        mockedWallet.id,
        'withdraw',
        1000
      )).rejects.toEqual(new NotEnoughBallanceError());
    });
  });
});
