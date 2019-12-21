import UserService from '../../src/user/UserService';
import UserNotFoundError from '../../src/error/UserNotFoundError';
import WalletService from '../../src/wallet/WalletService';

describe('UserService', () => {
  let models;
  let userService;
  let walletService;
  let mockedUser;
  let mockedWallet;
  beforeEach(() => {
    models = {
      User: {
        addUser: jest.fn(),
        findById: jest.fn(),
        findByPasswordEmail: jest.fn(),
        findByCashtag: jest.fn()
      },
      Wallet: {
        addWallet: jest.fn()
      }
    };
    userService = new UserService(models);
    walletService = new WalletService(models);
    walletService.addWalletForUser = jest.fn();
    mockedUser = {
      id: 1,
      name: 'Mitshuki Temannya Boruto',
      cashtag: 'mitshuki',
      email: 'mitshuki@konoha.com',
      phoneNumber: '+1 123321123',
      address: 'suatu rumah di konoha',
      profileImage: 'img/mitshuki.jpg',
      updateUser: jest.fn()
    };
    mockedWallet = {
      id: 1,
      userId: mockedUser.id,
      balance: 0
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#createUser', () => {
    it('should create new user and have wallet with idUser same with inserted user and balance 0', async () => {
      models.User.addUser.mockResolvedValue(mockedUser);
      walletService.addWalletForUser.mockResolvedValue(mockedWallet);
      models.Wallet.addWallet.mockResolvedValue(mockedWallet);
      const dataUser = {
        name: 'Mitshuki Temannya Boruto',
        email: 'mitshuki@konoha.com',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        profileImage: 'img/mitshuki.jpg'
      };

      const result = await userService.createUser(dataUser);

      expect(result).toMatchObject(mockedUser);
    });
  });

  describe('#getUserById', () => {
    it('should get user by user id', async () => {
      models.User.findById.mockResolvedValue(mockedUser);

      const result = await userService.findUserById(mockedUser.id);

      expect(result).toEqual(mockedUser);
    });

    it('should throw UserNotFound Error when no user with that id', async () => {
      models.User.findById.mockResolvedValue();

      await expect(userService.findUserById(mockedUser.id))
        .rejects.toEqual(new UserNotFoundError());
    });
  });

  describe('#updateUserById', () => {
    const valuesToUpdate = {
      name: 'alam priyatna',
      address: 'Pancoran timur'
    };
    it('should returned updated user based on the id', async () => {
      const updatedUser = {
        id: 1,
        name: 'alam priyatna',
        address: 'Pancoran timur',
        phoneNumber: '087760118555'
      };
      mockedUser.updateUser.mockResolvedValue(updatedUser);
      models.User.findById.mockResolvedValue(mockedUser);

      const result = await userService.updateUserById(mockedUser.id, valuesToUpdate);

      expect(result).toEqual(updatedUser);
    });

    it('should throw error "User Not Found" when the user is not available', async () => {
      models.User.findById.mockResolvedValue();

      await expect(userService.updateUserById(mockedUser.id, valuesToUpdate))
        .rejects.toEqual(new UserNotFoundError());
    });
  });

  describe('#findUserByPasswordEmail', () => {
    it('should return user data', async () => {
      models.User.findByPasswordEmail.mockResolvedValue(mockedUser);
      const result = await userService.findUserByPasswordEmail(mockedUser.email, 'asdfasdfasdf');

      expect(result).toEqual(mockedUser);
    });

    it('should throw user not found error', async () => {
      models.User.findByPasswordEmail.mockResolvedValue(null);

      await expect(userService.findUserByPasswordEmail(mockedUser.email, 'asdfasdfasdf'))
        .rejects.toEqual(new UserNotFoundError());
    });
  });

  describe('#getUserByCashtag', () => {
    it('should get user by user cashtag', async () => {
      models.User.findByCashtag.mockResolvedValue(mockedUser);

      const result = await userService.findUserByCashtag(mockedUser.cashtag);

      expect(result).toEqual(mockedUser);
    });
  });
});
