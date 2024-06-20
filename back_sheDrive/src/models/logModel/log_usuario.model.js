const sequelize = require("#DB/sequelize");
const config = require("#SRC/config/index");
const { DataTypes } = require("sequelize");

const LogUsuario = sequelize.define(
  "log_usuario",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    IDTHIS: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_tipoDocumento: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    id_personalBase: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    numDocumento: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: {
        msg: "Ya existe un usuario registrado con este numero de documento",
      },
    },
    usuario: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: { msg: "ya existe un registro creado con este usuario" },
    },
    contrasenna: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    celular: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    correo: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: { msg: "ya existe un usuario creado con este correo" },
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    cambiarContrasenna: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "true: debe cambiar contraseña; false: ya cambio la contraseña",
    },
    intentosLogin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ipUsuarioOperacion: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    idUsuarioOperacion: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    clientAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipoOperacion: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    createdAt: true,
    updatedAt: false,
    tableName: "log_usuario",
    freezeTableName: true,
    schema: config.schemaTwo,
  }
);

module.exports = LogUsuario;
