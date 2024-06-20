"use strict";

const { getColumsSaredLogs } = require("#H/functions");
const Config = require("#SRC/config/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable(
        {
          name: "log_usuario",
          tableName: "log_usuario",
          schema: Config.schemaTwo,
        },
        {
          id_tipoDocumento: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
          },
          numDocumento: {
            type: Sequelize.DataTypes.STRING(30),
            allowNull: false,
          },
          usuario: {
            type: Sequelize.DataTypes.STRING(60),
            allowNull: false,
            unique: { msg: "ya existe un registro creado con este usuario" },
          },
          contrasenna: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
          nombre: {
            type: Sequelize.DataTypes.STRING(60),
            allowNull: false,
          },
          apellido: {
            type: Sequelize.DataTypes.STRING(60),
            allowNull: false,
          },
          celular: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: true,
            defaultValue: null,
          },
          correo: {
            type: Sequelize.DataTypes.STRING(60),
            allowNull: false,
            unique: { msg: "ya existe un usuario creado con este correo" },
          },
          token: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
          },
          cambiarContrasenna: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment:
              "true: debe cambiar contraseña; false: ya cambio la contraseña",
          },
          intentosLogin: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          activo: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          ...getColumsSaredLogs(Sequelize),
        }
      );
      console.log("+++++++__S__U__C__C__E__S__S__++++++", "log_usuario");
    } catch (error) {
      console.log(
        "E_R_R_O_R createTable MIG:: " + "log_usuario" + " message=>",
        error.message
      );
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable({
        tableName: "log_usuario",
        schema: Config.schemaTwo,
      });
      console.log("+++++++D_R_O_P++++++", "log_usuario");
    } catch (error) {
      console.log(
        "error dropTable:: " + "log_usuario" + " message==>",
        error.message
      );
    }
  },
};
