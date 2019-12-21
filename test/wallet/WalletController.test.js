import request from 'supertest';
import app from '../../src/app';

describe('WalletController', () => {
  const {
    User,
    Wallet
  } = app.locals.models;
  beforeEach(async () => {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    await Wallet.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
  });
  describe('GET /users/:userId/wallets', () => {
    it('should return status code 200 and return the wallet based on id', async () => {
      const { userService } = app.locals.services; const dataUser = {
        name: 'Mitshuki Temannya Boruto',
        cashtag: 'mitshuki',
        email: 'mitshuki@konoha.com',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        password: '3da541559918a808c2402bba5012f6c60b27661c'
      };
      const savedUser = await userService.createUser(dataUser);
      const savedWallet = await Wallet.findOne({
        where: {
          userId: savedUser.id
        }
      });
      const expectedResult = JSON.parse(JSON.stringify(savedWallet));

      const response = await request(app)
        .get(`/users/${savedUser.id}/wallets`)
        .expect(200);
      expect(response.body)
        .toMatchObject(expectedResult);
    });

    it('should throw error "Wallet Not Found Error" when wallet with that user id is not in table', async () => {
      const response = await request(app)
        .get('/users/2345/wallets')
        .expect(404);

      expect(response.body.message)
        .toEqual('Wallet Not Found');
    });

    it('should throw error "Bad Request" when the userid is not an integer', async () => {
      const response = await request(app)
        .get('/users/0.124/wallets')
        .expect(400);

      expect(response.body.message)
        .toEqual('"userId" must be an integer');
    });
  });
});
