const { DataTypes } = require("sequelize");
const sequelize = require("#DB/sequelize");
const Config = require("#SRC/config/index");
const TipoDocumento = require("./tipoDocumento.model");
const { relationOneToMany, createRecordLogs } = require("./_index");
const LogUsuario = require("./logModel/log_usuario.model");

const Usuario = sequelize.define(
  "usuario",
  {
    idUsuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // id_tipoDocumento √
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
  },
  {
    timestamps: true,
    tableName: "usuario",
    indexes: [
      {
        unique: true,
        fields: ["idUsuario"],
      },
    ],
    hooks: {
      afterCreate: async (data) => {
        await createRecordLogs({
          Model: LogUsuario,
          values: { ...data.dataValues, IDTHIS: data?.idUsuario },
        });
      },
      beforeBulkUpdate: (options) => {
        // habilitar los hoos de instancia para cada registro actualizado
        options.individualHooks = true;
      },
      afterUpdate: async (data) => {
        await createRecordLogs({
          Model: LogUsuario,
          values: { ...data.dataValues, IDTHIS: data?.idUsuario },
        });
      },
    },
    schema: Config.schemaOne,
  }
);

relationOneToMany({
  One: TipoDocumento,
  ToMany: Usuario,
  foreignKey: "id_tipoDocumento",
});
module.exports = Usuario;
