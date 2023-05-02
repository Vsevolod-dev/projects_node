'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('images', 'desc', {
      type: Sequelize.DataTypes.STRING,
      after: "order"
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('images', 'desc')
  }
};
