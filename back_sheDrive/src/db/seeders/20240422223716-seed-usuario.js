"use strict";
const usuarios = require("../../../jsons/usuarios.json");
const config = require("#SRC/config/index");
const { hashValue } = require("#H/functions");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const data = usuarios.map((usuario) => ({
        ...usuario,
        contrasenna: hashValue(usuario.contrasenna || "password"),
      }));
      await queryInterface.bulkInsert(
        { tableName: "usuario", schema: config.schemaOne },
        data,
        {}
      );
      console.log("success seed usuario");
    } catch (error) {
      console.log("error::", error.message);
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete(
        { tableName: "usuario", schema: config.schemaOne },
        {},
        {}
      );
    } catch (error) {
      console.log("error::", error.message);
    }
  },
};
