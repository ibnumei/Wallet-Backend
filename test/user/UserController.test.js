import request from 'supertest';
import MockDate from 'mockdate';
import app from '../../src/app';

describe('UserController', () => {
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
  describe('POST /users', () => {
    it('should has data in user table which same with the inserted data and wallet with same userId', async () => {
      const savedUser = {
        name: 'Mitshuki Temannya Boruto',
        cashtag: 'mitshuki',
        email: 'mitshuki@konoha.com',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        password: 'asdf'
      };

      const response = await request(app)
        .post('/users')
        .send(savedUser)
        .expect(201);
      expect(response.body).toMatchObject(savedUser);
      let responseWallet = await Wallet.findOne({
        where: { userId: response.body.id }
      });
      responseWallet = JSON.parse(JSON.stringify(responseWallet));
      expect(responseWallet.userId).toEqual(response.body.id);
      expect(parseFloat(responseWallet.balance)).toEqual(0);
    });

    it('should throw error bad request when the name field is not given', async () => {
      const savedUser = {
        address: 'Pancoran, Jakarta Selatan',
        phoneNumber: '087760118555'
      };

      const response = await request(app)
        .post('/users')
        .send(savedUser)
        .expect(400);
      expect(response.body.message).toEqual('"name" is required');
    });
  });

  describe('GET /users/:id', () => {
    it('should return status code 200 and return the user based on id', async () => {
      const { userService } = app.locals.services;
      const dataUser = {
        name: 'Mitshuki Temannya Boruto',
        cashtag: 'mitshuki',
        email: 'mitshuki@konoha.com',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        password: 'asdf'
      };
      const savedUser = await userService.createUser(dataUser);
      const expectedResult = JSON.parse(JSON.stringify(savedUser));
      const response = await request(app)
        .get(`/users/${savedUser.id}`)
        .expect(200);
      expect(response.body).toMatchObject(expectedResult);
    });

    it('should throw error "User Not Found Error "when user is not in table', async () => {
      const response = await request(app)
        .get('/users/3456')
        .expect(404);

      expect(response.body.message).toEqual('User Not Found');
    });

    it('should throw error ""id" must be an integer" when the id is not an integer', async () => {
      const response = await request(app)
        .get('/users/0.1')
        .expect(400);

      expect(response.body.message)
        .toEqual('"id" must be an integer');
    });
  });

  describe('PUT /users/:id', () => {
    it('should return status code 201 and the updated user with the updated updated_at', async () => {
      MockDate.set('2019-11-23');
      const { userService } = app.locals.services;
      const dataUser = {
        name: 'Mitshuki Temannya Boruto',
        cashtag: 'mitshuki',
        email: 'mitshuki@konoha.com',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        password: 'asdf'
      };
      const savedUser = await userService.createUser(dataUser);
      let updatedUser = {
        name: 'alam priyatna',
        address: 'Pancoran timur',
        phoneNumber: '+1 123321123'
      };
      MockDate.set('2019-11-29');
      const date = new Date();
      updatedUser = JSON.parse(JSON.stringify(updatedUser));
      const valuesToUpdate = {
        name: 'alam priyatna',
        address: 'Pancoran timur'
      };

      const response = await request(app)
        .put(`/users/${savedUser.id}`)
        .send(valuesToUpdate)
        .expect(201);

      expect(response.body).toMatchObject(updatedUser);
      expect(new Date(response.body.updatedAt)).toEqual(date);
      MockDate.reset();
    });

    it('should throw error 404 "User Not Found" when the expected user id is not in db', async () => {
      const valuesToUpdate = {
        name: 'alam priyatna',
        address: 'Pancoran timur'
      };

      const response = await request(app)
        .put('/users/23456')
        .send(valuesToUpdate)
        .expect(404);

      expect(response.body.message).toEqual('User Not Found');
    });

    it('should throw error ""id" must be a number" when the id is not an integer', async () => {
      const response = await request(app)
        .put('/users/asdfasdf')
        .expect(400);

      expect(response.body.message)
        .toEqual('"id" must be a number');
    });

    it('should throw error ""name" must be a string" when the name is an integer', async () => {
      const { userService } = app.locals.services;
      const dataUser = {
        name: 'Mitshuki Temannya Boruto',
        cashtag: 'mitshuki',
        email: 'mitshuki@konoha.com',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        password: 'asdf'
      };
      const savedUser = await userService.createUser(dataUser);
      const valuesToUpdate = {
        name: 1,
        address: 'Pancoran timur'
      };

      const response = await request(app)
        .put(`/users/${savedUser.id}`)
        .send(valuesToUpdate)
        .expect(400);

      expect(response.body.message)
        .toEqual('"name" must be a string');
    });
  });

  describe('GET /users?cashtag={cashtag}', () => {
    it('should return status code 200 and return the user based on cashtag', async () => {
      const { userService } = app.locals.services;
      const dataUser = {
        name: 'Mitshuki Temannya Boruto',
        cashtag: 'mitshuki',
        email: 'mitshuki@konoha.com',
        phoneNumber: '+1 123321123',
        address: 'suatu rumah di konoha',
        profileImage: 'img/mitshuki.jpg',
        password: 'asdf'
      };
      const savedUser = await userService.createUser(dataUser);
      const expectedResult = JSON.parse(JSON.stringify(savedUser));
      const response = await request(app)
        .get(`/users?cashtag=${savedUser.cashtag}`)
        .expect(200);
      expect(response.body).toMatchObject([expectedResult]);
    });

    it('should throw error ""cashtag" is not allowed to be empty" when cashtag is empty', async () => {
      const response = await request(app)
        .get('/users?cashtag')
        .expect(400);

      expect(response.body.message)
        .toEqual('"cashtag" is not allowed to be empty');
    });
  });
});
