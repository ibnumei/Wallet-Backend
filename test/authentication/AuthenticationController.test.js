import request from 'supertest';
import app from '../../src/app';

describe('AuthenticationController', () => {
  const {
    User,
    Wallet
  } = app.locals.models;
  beforeEach(async () => {
    await Wallet.destroy({
      cascade: true,
      truncate: true,
      restartIdentity: true
    });

    await User.destroy({
      cascade: true,
      truncate: true,
      restartIdentity: true
    });
  });
  describe('POST /login', () => {
    it('should return the token when the user input the right email and password', async () => {
      const dataUser = {
        name: 'Mitshuki Temannya Boruto',
        cashtag: 'mitshuki',
        email: 'asdf@asdf',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        password: '3da541559918a808c2402bba5012f6c60b27661c'
      };
      const { userService } = app.locals.services;
      await userService.createUser(dataUser);
      const inputedData = {
        email: 'asdf@asdf',
        password: 'asdf'
      };

      const response = await request(app)
        .post('/login')
        .send(inputedData)
        .expect(200);

      expect(response.body.token).toBeDefined();
    });
  });
});

