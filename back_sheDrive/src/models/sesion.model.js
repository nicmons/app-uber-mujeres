const { DataTypes } = require("sequelize");
const sequelize = require("#DB/sequelize");
const config = require("#SRC/config/index");
const { relationOneToMany, createRecordLogs } = require("./_index");
// const LogsSesiones = require("./logModels/logs_sesiones.model");
const Usuario = require("./usuario.model.js");
const LogSesion = require("./logModel/log_sesion.model.js");

const Sesion = sequelize.define(
  "sesion",
  {
    idSesion: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // id_usuario √
    ipSesion: {
      type: DataTypes.INET,
      allowNull: false,
    },
    equipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaSesion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaLogOut: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "sesion",
    indexes: [
      {
        unique: true,
        fields: ["idSesion"],
      },
    ],
    hooks: {
      afterCreate: async (data) => {
        await createRecordLogs({
          Model: LogSesion,
          values: { ...data.dataValues, IDTHIS: data?.idSesion },
        });
      },
      beforeBulkUpdate: (options) => {
        // habilitar los hoos de instancia para cada registro actualizado
        options.individualHooks = true;
      },
      afterUpdate: async (data) => {
        await createRecordLogs({
          Model: LogSesion,
          values: { ...data.dataValues, IDTHIS: data?.idSesion },
        });
      },
    },
    schema: config.schemaOne,
  }
);

relationOneToMany({
  One: Usuario,
  ToMany: Sesion,
  foreignKey: "id_usuario",
});

module.exports = Sesion;
