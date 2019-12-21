import { Model, DataTypes } from 'sequelize';
import User from '../user/User';

/**
 * Represent a model to manage transaction table
 */
class Transaction extends Model {
  static init(sequelize) {
    return super.init({
      walletId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'wallet_id'
      },
      beneficiaryId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'beneficiary_id'
      },
      nominal: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'nominal'
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM('withdraw', 'deposit'),
        field: 'type'
      },
      description: {
        allowNull: false,
        type: String,
        field: 'description'
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
      modelName: 'transaction',
      tableName: 'transaction'
    });
  }
  static setAssociation(models) {
    const { Transaction: TransactionModel, Wallet: WalletModel, User: UserModel } = models;
    TransactionModel.belongsTo(WalletModel, { foreignKey: 'walletId' });
    TransactionModel.belongsTo(UserModel, { as: 'beneficiaryData', foreignKey: 'beneficiaryId' });
  }

  static addTransaction(dataTransaction) {
    return Transaction.create(dataTransaction);
  }

  static findByWalletId(walletId, limit) {
    return Transaction.findAll({
      include: [{
        model: User,
        as: 'beneficiaryData',
        attributes: ['id', 'name', 'cashtag']
      }],
      where: {
        walletId
      },
      limit,
      order: [
        ['createdAt', 'DESC']
      ]
    });
  }
}

export default Transaction;
