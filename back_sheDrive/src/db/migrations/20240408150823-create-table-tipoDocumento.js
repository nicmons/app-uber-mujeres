"use strict";

const Config = require("#SRC/config/index");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable(
        {
          name: "tipoDocumento",
          tableName: "tipoDocumento",
          schema: Config.schemaOne,
        },
        {
          idTipoDocumento: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          nombre: {
            type: Sequelize.DataTypes.STRING(60),
            allowNull: false,
          },
          abrev: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: false,
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
      console.log("+++++++__S__U__C__C__E__S__S__++++++", "tipoDocumento");
    } catch (error) {
      console.log(
        "E_R_R_O_R createTable MIG:: " + "tipoDocumento" + " message=>",
        error.message
      );
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable({
        tableName: "tipoDocumento",
        schema: Config.schemaOne,
      });
      console.log("+++++++D_R_O_P++++++", "tipoDocumento");
    } catch (error) {
      console.log(
        "error dropTable:: " + "tipoDocumento" + " message==>",
        error.message
      );
    }
  },
};
