const { DataTypes } = require("sequelize");
const sequelize = require("#DB/sequelize");
const config = require("#SRC/config/index");
const { relationsManyToMany, createRecordLogs } = require("./_index");
const Usuario = require("./usuario.model");
const Perfil = require("./perfil.model");
const LogPerfilUsuario = require("./logModel/log_perfilUsuario.model");

const PerfilUsuario = sequelize.define(
  "perfilUsuario",
  {
    idPerfilUsuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // id_perfil √
    // id_usuario √
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "perfilUsuario",
    indexes: [
      {
        unique: true,
        fields: ["idPerfilUsuario"],
      },
    ],
    hooks: {
      afterCreate: async (data) => {
        await createRecordLogs({
          Model: LogPerfilUsuario,
          values: { ...data.dataValues, IDTHIS: data?.idPerfilUsuario },
        });
      },
      beforeBulkUpdate: (options) => {
        // habilitar los hoos de instancia para cada registro actualizado
        options.individualHooks = true;
      },
      afterUpdate: async (data) => {
        await createRecordLogs({
          Model: LogPerfilUsuario,
          values: { ...data.dataValues, IDTHIS: data?.idPerfilUsuario },
        });
      },
    },
    schema: config.schemaOne,
  }
);

relationsManyToMany({
  Through: PerfilUsuario,
  Models: [
    { model: Perfil, foreign: "id_perfil" },
    { model: Usuario, foreign: "id_usuario" },
  ],
});

module.exports = PerfilUsuario;
