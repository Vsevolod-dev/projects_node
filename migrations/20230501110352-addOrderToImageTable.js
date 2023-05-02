'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('images', 'order', {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      after: "project_id"
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('images', 'order')
  }
};
