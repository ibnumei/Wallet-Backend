import { Model, DataTypes } from 'sequelize';

/**
 * Represent a model to manage user table
 */
class User extends Model {
  static init(sequelize) {
    return super.init({
      name: {
        allowNull: false,
        type: String,
        field: 'name'
      },
      cashtag: {
        allowNull: false,
        type: String,
        field: 'cashtag'
      },
      address: {
        allowNull: false,
        type: String,
        field: 'address'
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'phone_number'
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'email'
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'password'
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
      modelName: 'user',
      tableName: 'user'
    });
  }

  static addUser(dataUser) {
    return User.create(dataUser);
  }

  static findById(id) {
    return User.findOne({ where: { id } });
  }

  static findByCashtag(cashtag) {
    return User.findAll({ where: { cashtag } });
  }


  updateUser(updateValues) {
    return this.update({
      ...updateValues,
      updatedAt: Date.now()
    });
  }

  static findByPasswordEmail(email, password) {
    return User.findOne({
      where: { email, password },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
  }
}

export default User;
