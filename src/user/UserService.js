import UserNotFoundError from '../error/UserNotFoundError';
import WalletService from '../wallet/WalletService';

/**
 * Represent the business logic of the user end point
 */
export default class UserService {
  constructor(models) {
    this._models = models;
  }

  async createUser(dataUser) {
    const walletService = new WalletService(this._models);
    const { User } = this._models;
    const newUser = await User.addUser(dataUser);
    await walletService.addWalletForUser(newUser.id);
    return newUser;
  }

  async findUserById(userId) {
    const { User } = this._models;
    const user = await User.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  async updateUserById(id, updateValues) {
    try {
      const user = await this.findUserById(id);
      const updatedUser = await user.updateUser(updateValues);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async findUserByPasswordEmail(email, password) {
    const { User } = this._models;
    const user = await User.findByPasswordEmail(email, password);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  async findUserByCashtag(cashtag) {
    const { User } = this._models;
    const user = await User.findByCashtag(cashtag);
    return user;
  }
}
