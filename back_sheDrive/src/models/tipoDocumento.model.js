const { DataTypes } = require("sequelize");
const sequelize = require("#DB/sequelize");
const Config = require("#SRC/config/index");

const TipoDocumento = sequelize.define(
  "tipoDocumento",
  {
    idTipoDocumento: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    abrev: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "tipoDocumento",
    indexes: [
      {
        unique: true,
        fields: ["idTipoDocumento"],
      },
    ],
    schema: Config.schemaOne,
  }
);

module.exports = TipoDocumento;
