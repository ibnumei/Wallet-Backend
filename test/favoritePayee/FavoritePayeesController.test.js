import request from 'supertest';
import app from '../../src/app';

describe('favoritePayee', () => {
  const {
    User,
    Payee
  } = app.locals.models;
  let firstUser;
  let secondUser;
  let dataFavoritePayee;
  const { userService } = app.locals.services;
  beforeEach(async () => {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    await Payee.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    });

    const firstDataUser = {
      name: 'Boruto',
      cashtag: 'Boruto',
      email: 'mitshuki@konoha.com',
      phoneNumber: '+1 123321123',
      address: 'suatu rumah di konoha',
      profileImage: 'img/mitshuki.jpg',
      password: 'asdf'
    };
    const secondDataUser = {
      name: 'Mitshuki ',
      cashtag: 'mitshuki',
      email: 'mitshuki@konoha.com',
      phoneNumber: '+1 123321123',
      address: 'suatu rumah di konoha',
      profileImage: 'img/mitshuki.jpg',
      password: 'asdf'
    };
    firstUser = await userService.createUser(firstDataUser);
    secondUser = await userService.createUser(secondDataUser);

    dataFavoritePayee = {
      userId: firstUser.id,
      payeeId: secondUser.id
    };
    // dataFavoritePayee = await Payee.create(secondDataUser);
  });
  describe('POST', () => {
    it('should return response body like object that has been post', async () => {
      const response = await request(app)
        .post(`/users/${firstUser.id}/favorite-payees`)
        .send({
          payeeId: secondUser.id
        })
        .expect(201);
      const expectedResult = {
        userId: firstUser.id,
        payeeId: secondUser.id
      };
      expect(response.body).toMatchObject(expectedResult);
    });

    it('should return 401 forbidden error when payee is already added before', async () => {
      const expectedResult = 'Payee already added';

      await request(app)
        .post(`/users/${firstUser.id}/favorite-payees`)
        .send({
          payeeId: secondUser.id
        });
      const response = await request(app)
        .post(`/users/${firstUser.id}/favorite-payees`)
        .send({
          payeeId: secondUser.id
        })
        .expect(403);

      expect(response.body.message).toEqual(expectedResult);
    });
  });

  describe('GET', () => {
    it('should get data favorite payees based on user id', async () => {
      await Payee.create(dataFavoritePayee);

      const response = await request(app)
        .get(`/users/${firstUser.id}/favorite-payees`)
        .expect(200);
      expect(response.body).toMatchObject([dataFavoritePayee]);
    });
  });
});
