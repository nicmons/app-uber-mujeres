const { DataTypes } = require("sequelize");
const sequelize = require("#DB/sequelize");
const config = require("#SRC/config/index");

const TipoNovedad = sequelize.define(
  "tipoNovedad",
  {
    idTipoNovedad: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    strCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reporte: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    especial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "tipoNovedad",
    indexes: [
      {
        unique: true,
        fields: ["idTipoNovedad"],
      },
    ],
    schema: config.schemaOne,
  }
);

module.exports = TipoNovedad;
