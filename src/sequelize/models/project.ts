import { DataTypes } from 'sequelize';
import Project from '../../types/models/project';
import sequelize from '..';

const Project = sequelize.define<Project>('project', {
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
    },
    url: {
      type: DataTypes.TEXT
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
    },
  }, 
  {
    underscored: true,
    paranoid: true,
  }
)

export default Project
