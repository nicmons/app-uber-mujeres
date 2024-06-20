const { DataTypes } = require("sequelize");
const sequelize = require("#DB/sequelize");
const config = require("#SRC/config/index");

const Perfil = sequelize.define(
  "perfil",
  {
    idPerfil: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    strCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "perfil",
    indexes: [
      {
        unique: true,
        fields: ["idPerfil"],
      },
    ],
    schema: config.schemaOne,
  }
);

module.exports = Perfil;
