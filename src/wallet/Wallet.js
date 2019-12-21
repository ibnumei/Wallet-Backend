import { Model, DataTypes } from 'sequelize';

/**
 * Represent a model to manage wallet table
 */
class Wallet extends Model {
  static init(sequelize) {
    return super.init({
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'user_id'
      },
      balance: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'balance'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    }, {
      sequelize,
      modelName: 'wallet',
      tableName: 'wallet'
    });
  }

  static setAssociation(models) {
    const { User: UserModel, Wallet: WalletModel } = models;
    WalletModel.belongsTo(UserModel, { foreignKey: 'userId' });
  }

  static addWallet(userId) {
    return Wallet.create({
      userId,
      balance: parseFloat(0, 10)
    });
  }

  static findByUserId(userId) {
    return Wallet.findOne({ where: { userId } });
  }

  async updateBalance(nominal) {
    const updatedWallet = await this.update({
      balance: this.getDataValue('balance') + nominal,
      updatedAt: Date.now()
    });
    return updatedWallet;
  }
}

export default Wallet;
