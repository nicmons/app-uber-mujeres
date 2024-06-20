'use strict';
const perfiles = require("../../../jsons/perfiles.json");
const config = require("#SRC/config/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    try {
      const data = perfiles.map((perfil) => ({
        ...perfil,
      }));
      await queryInterface.bulkInsert(
        { tableName: "perfil", schema: config.schemaOne },
        data,
        {}
      );
      console.log("success seed perfil");
    } catch (error) {
      console.log("error::", error.message);
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete(
        { tableName: "perfil", schema: config.schemaOne },
        {},
        {}
      );
    } catch (error) {
      console.log("error::", error.message);
    }
  },
};
