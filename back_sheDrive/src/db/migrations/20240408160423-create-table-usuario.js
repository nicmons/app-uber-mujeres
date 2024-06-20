"use strict";
const Config = require("#SRC/config/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable(
        { name: "usuario", tableName: "usuario", schema: Config.schemaOne },
        {
          idUsuario: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          id_tipoDocumento: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "tipoDocumento",
              key: "idTipoDocumento",
            },
            onDelete: "RESTRICT",
          },
          numDocumento: {
            type: Sequelize.DataTypes.STRING(30),
            allowNull: false,
            unique: {
              msg: "Ya existe un usuario registrado con este numero de documento",
            },
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
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            field: "createdAt",
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
            field: "updatedAt",
          },
        }
      );
      console.log("+++++++__S__U__C__C__E__S__S__++++++", "usuario");
    } catch (error) {
      console.log(
        "E_R_R_O_R createTable MIG:: " + "usuario" + " message=>",
        error.message
      );
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable({
        tableName: "usuario",
        schema: Config.schemaOne,
      });
      console.log("+++++++D_R_O_P++++++", "usuario");
    } catch (error) {
      console.log(
        "error dropTable:: " + "usuario" + " message==>",
        error.message
      );
    }
  },
};
