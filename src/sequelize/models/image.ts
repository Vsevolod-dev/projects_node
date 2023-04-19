import { DataTypes } from 'sequelize';
import Image from '../../types/models/image';
import sequelize from '..';

const Image = sequelize.define<Image>('image', {
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
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    project_id: {
      type: DataTypes.BIGINT.UNSIGNED
    },
  }, 
  {
    underscored: true,
    paranoid: true
  }
)

export default Image
