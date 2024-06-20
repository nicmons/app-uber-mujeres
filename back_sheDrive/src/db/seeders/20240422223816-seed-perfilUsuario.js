"use strict";
const perfilUsuarios = require("../../../jsons/perfilUsuarios.json");
const config = require("#SRC/config/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const data = perfilUsuarios.map((perfilUsuario) => ({
        ...perfilUsuario,
      }));
      await queryInterface.bulkInsert(
        { tableName: "perfilUsuario", schema: config.schemaOne },
        data,
        {}
      );
      console.log("success seed perfilUsuario");
    } catch (error) {
      console.log("error::", error.message);
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete(
        { tableName: "perfilUsuario", schema: config.schemaOne },
        {},
        {}
      );
    } catch (error) {
      console.log("error::", error.message);
    }
  },
};
