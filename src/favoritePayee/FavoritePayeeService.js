import PayeeAlreadyAdded from '../error/PayeeAlreadyAdded';

export default class FavoritePayeeService {
  constructor(models) {
    this._models = models;
  }

  async addPayee(dataPayee) {
    const { userId, payeeId } = dataPayee;
    const { Payee } = this._models;
    if (await this._checkPayee(userId, payeeId)) {
      throw new PayeeAlreadyAdded();
    }
    const payeeData = {
      userId,
      payeeId
    };
    const newPayee = await Payee.addPayee(payeeData);
    return newPayee;
  }

  async findPayeesByUserId(userId) {
    const { Payee } = this._models;
    const payee = await Payee.findByUserId(userId);
    return payee;
  }

  async _checkPayee(userId, payeeId) {
    const { Payee } = this._models;
    const response = await Payee.findPayee(userId, payeeId);
    return response;
  }
}
