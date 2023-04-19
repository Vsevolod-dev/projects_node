'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.changeColumn('images', 'project_id', {
        type: Sequelize.DataTypes.BIGINT.UNSIGNED,
        defaultValue: null,
        allowNull: true
      })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('images', 'project_id', {
      type: Sequelize.DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    })
  }
};
