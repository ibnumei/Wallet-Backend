import FavoritePayeeService from '../../src/favoritePayee/FavoritePayeeService';

describe('FavoritePayeeService', () => {
  let models;
  let payeeService;
  let mockedPayee;
  beforeEach(() => {
    models = {
      Payee: {
        findByUserId: jest.fn(),
        addPayee: jest.fn(),
        findPayee: jest.fn()
      }
    };
    payeeService = new FavoritePayeeService(models);
    mockedPayee = {
      id: 1,
      userId: 1,
      payeeId: 2
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('#findByUserId', () => {
    it('should get payee by user id', async () => {
      models.Payee.findByUserId.mockResolvedValue(mockedPayee);

      const result = await payeeService.findPayeesByUserId(mockedPayee.id);

      expect(result).toEqual(mockedPayee);
    });
  });

  describe('#addPayee', () => {
    it('should return added favorite payee', async () => {
      const data = {
        userId: 1,
        payeeId: 2
      };
      models.Payee.findPayee.mockResolvedValue();
      models.Payee.addPayee.mockResolvedValue(mockedPayee);

      const actualResult = await payeeService.addPayee(data);

      expect(actualResult).toMatchObject(mockedPayee);
    });
  });
});
