const { messages } = require("#H/utils");
const { body, param } = require("express-validator");
const { validateResults, noExistId } = require("./_index");
const Usuario = require("#M/usuario.model");
const TipoDocumento = require("#M/tipoDocumento.model");

exports.validate_update_usuario = [
  param("idUsuario")
    .exists()
    .notEmpty()
    .custom(noExistId(Usuario, "No existe registro id Usuario", {}, false))
    .withMessage(messages.CAMPO_REQUERIDO("idUsuario"))
    .bail(),
  body("numDocumento")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_REQUERIDO("id reporteNovedad"))
    .bail(),
  body("nombre")
    .exists()
    .notEmpty()
    .isString()
    .withMessage(messages.CAMPO_REQUERIDO("nombre"))
    .bail(),
  body("apellido")
    .exists()
    .notEmpty()
    .isString()
    .withMessage(messages.CAMPO_REQUERIDO("apellido"))
    .bail(),
  body("celular")
    .exists()
    .notEmpty()
    .isString()
    .withMessage(messages.CAMPO_REQUERIDO("celular"))
    .bail(),
  body("correo")
    .exists()
    .notEmpty()
    .isString()
    .withMessage(messages.CAMPO_REQUERIDO("correo"))
    .bail(),
  body("activo")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("activo"))
    .bail(),
  body("contrasenna")
    .optional({ values: null })
    .notEmpty()
    .isString()
    .withMessage(messages.CAMPO_REQUERIDO("contrasenna"))
    .bail(),
  body("id_tipoDocumento")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("id_tipoDocumento"))
    .custom(
      noExistId(TipoDocumento, "No existe un registro de ese tipo de documento")
    )
    .bail(),
  body("arrayPerfil").optional({ values: null }).isArray({ min: 0 }).bail(),
  validateResults(),
];

exports.validate_enable_password = [
  param("idUsuario")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("usuario")),
  validateResults(),
];
