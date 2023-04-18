import { DataTypes } from 'sequelize';
import Tag from '../../types/models/tag';
import sequelize from '..';

const Tag = sequelize.define<Tag>(
  'tag', 
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, 
  {
    underscored: true,
    paranoid: true
  }
)

export default Tag