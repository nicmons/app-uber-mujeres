"use strict";

const Config = require("#SRC/config/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable(
        {
          name: "sesion",
          tableName: "sesion",
          schema: Config.schemaOne,
        },
        {
          idSesion: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          id_usuario: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "usuario",
              key: "idUsuario",
            },
            onDelete: "RESTRICT",
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
      console.log("+++++++__S__U__C__C__E__S__S__++++++", "sesion");
    } catch (error) {
      console.log(
        "E_R_R_O_R createTable MIG:: " + "sesion" + " message=>",
        error.message
      );
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable({
        tableName: "sesion",
        schema: Config.schemaOne,
      });
      console.log("+++++++D_R_O_P++++++", "sesion");
    } catch (error) {
      console.log(
        "error dropTable:: " + "sesion" + " message==>",
        error.message
      );
    }
  },
};
