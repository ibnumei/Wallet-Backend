import MockDate from 'mockdate';
import request from 'supertest';
import app from '../../src/app';

describe('TransactionController', () => {
  const {
    User,
    Wallet,
    Transaction
  } = app.locals.models;
  const { userService, transactionService } = app.locals.services;
  let dataUser;
  let savedUser;
  let savedWallet;
  let savedTransaction;
  let dataTransaction;
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

    await Transaction.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    dataUser = {
      name: 'Mitshuki Temannya Boruto',
      cashtag: 'mitshuki',
      email: 'mitshuki@konoha.com',
      phoneNumber: '+1 123321123',
      address: 'suatu rumah di konoha',
      password: '3da541559918a808c2402bba5012f6c60b27661c'
    };
    savedUser = await userService.createUser(dataUser);
    savedWallet = await Wallet.findOne({
      where: {
        userId: savedUser.id
      }
    });
    savedTransaction = {
      walletId: savedWallet.id,
      type: 'deposit',
      nominal: 1000,
      description: 'test'
    };
    dataTransaction = {
      userId: savedUser.id,
      type: 'deposit',
      nominal: 1000,
      description: 'test'
    };
  });
  describe('POST /users/:userId/wallets/:walletId/transactions', () => {
    it('should has data transactions and the balance of wallet is updated', async () => {
      const expectedWalletBalance = 10000;

      savedTransaction = {
        type: 'deposit',
        description: 'Belanja siruken',
        nominal: 10000
      };

      const response = await request(app)
        .post(`/users/${savedUser.id}/wallets/${savedWallet.id}/transactions`)
        .send(savedTransaction)
        .expect(201);
      expect(response.body).toMatchObject({
        ...savedTransaction
      });
      let responseWallet = await Wallet.findOne({
        where: { id: savedWallet.id }
      });
      responseWallet = JSON.parse(JSON.stringify(responseWallet));
      expect(parseFloat(responseWallet.balance)).toEqual(expectedWalletBalance);
    });

    it('should throw error TransactionError when the initial balance is 0 and doing withdraw 1000', async () => {
      const response = await request(app)
        .post(`/users/${savedUser.id}/wallets/${savedWallet.id}/transactions`)
        .send({
          type: 'withdraw',
          nominal: 10000,
          description: 'Belanja siruken'
        })
        .expect(403);
      expect(response.body.message).toEqual('Transaction make the balance less than 0');
    });

    it('should throw error WalletNotFoundError when wallet is not in database', async () => {
      const response = await request(app)
        .post(`/users/123/wallets/${savedWallet.id}/transactions`)
        .send({
          type: 'withdraw',
          nominal: 10000,
          description: 'Belanja siruken'
        })
        .expect(404);
      expect(response.body.message).toEqual('Wallet Not Found');
    });
  });

  describe('#getTransaction', () => {
    it('should return list of transactions based wallet id', async () => {
      await transactionService.createTransaction(dataTransaction);

      const response = await request(app)
        .get(`/users/${savedWallet.userId}/wallets/${savedWallet.id}/transactions`)
        .expect(200);
      expect(response.body).toMatchObject([savedTransaction]);
    });

    it('should return non element array when the limit is 0', async () => {
      await transactionService.createTransaction(dataTransaction);

      const response = await request(app)
        .get(`/users/${savedWallet.userId}/wallets/${savedWallet.id}/transactions?limit=0`)
        .expect(200);
      expect(response.body).toMatchObject([]);
    });

    it('should order the transaction based on date in descending order by default', async () => {
      const fistDataTransaction = {
        userId: savedUser.id,
        type: 'deposit',
        nominal: 1000,
        description: 'test'
      };
      const secondDataTransaction = {
        userId: savedUser.id,
        type: 'withdraw',
        nominal: 100,
        description: 'test'
      };

      const expectedResult = [{
        type: 'withdraw',
        nominal: 100,
        description: 'test'
      }, {
        type: 'deposit',
        nominal: 1000,
        description: 'test'
      }];

      MockDate.set('2000-11-22');
      await transactionService.createTransaction(fistDataTransaction);
      MockDate.set('2020-11-22');
      await transactionService.createTransaction(secondDataTransaction);

      const response = await request(app)
        .get(`/users/${savedWallet.userId}/wallets/${savedWallet.id}/transactions?limit=5`)
        .expect(200);
      expect(response.body[0]).toMatchObject(expectedResult[0]);
      expect(response.body[1]).toMatchObject(expectedResult[1]);
      MockDate.reset();
    });
  });
});
