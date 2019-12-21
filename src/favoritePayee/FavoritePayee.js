import { Model, DataTypes } from 'sequelize';
import User from '../user/User';

/**
 * Represent a model to manage wallet table
 */
class FavoritePayee extends Model {
  static init(sequelize) {
    return super.init({
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'user_id'
      },
      payeeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'payee_id'
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
      modelName: 'payee',
      tableName: 'payee'
    });
  }

  static setAssociation(models) {
    const { User: UserModel, Payee: PayeeModel } = models;
    PayeeModel.belongsTo(UserModel, { foreignKey: 'payeeId' });
  }

  static addPayee(dataPayee) {
    return FavoritePayee.create(dataPayee);
  }

  static findByUserId(userId) {
    return FavoritePayee.findAll({
      include: [{
        model: User
      }],
      where: {
        userId
      }
    });
  }

  static findPayee(userId, payeeId) {
    return FavoritePayee.findOne({
      include: [{
        model: User
      }],
      where: {
        userId, payeeId
      }
    });
  }
}

export default FavoritePayee;
