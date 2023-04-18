import { DataTypes } from 'sequelize';
import sequelize from '..';

import User from '../../types/models/user';

const User = sequelize.define<User>(
  'user', 
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_verified_at: {
      type: DataTypes.DATE,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    remember_token: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    job: {
      type: DataTypes.STRING,
    },
    github: {
      type: DataTypes.STRING,
    },
    instagram: {
      type: DataTypes.STRING,
    },
    telegram: {
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
    paranoid: true
  }
)

export default User
