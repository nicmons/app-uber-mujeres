"use strict";

const Config = require("#SRC/config/index");
const { getColumsSaredLogs } = require("#H/functions");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable(
        {
          name: "log_sesion",
          tableName: "log_sesion",
          schema: Config.schemaTwo,
        },
        {
          id_usuario: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
          },
          ipSesion: {
            type: Sequelize.DataTypes.INET,
            allowNull: false,
          },
          equipo: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          clientAgent: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          fechaSesion: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          fechaLogOut: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          activo: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          ...getColumsSaredLogs(Sequelize),
        }
      );
      console.log("+++++++__S__U__C__C__E__S__S__++++++", "log_sesion");
    } catch (error) {
      console.log(
        "E_R_R_O_R createTable MIG:: " + "log_sesion" + " message=>",
        error.message
      );
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable({
        tableName: "log_sesion",
        schema: Config.schemaTwo,
      });
      console.log("+++++++D_R_O_P++++++", "log_sesion");
    } catch (error) {
      console.log(
        "error dropTable:: " + "log_sesion" + " message==>",
        error.message
      );
    }
  },
};
