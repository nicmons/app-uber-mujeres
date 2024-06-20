const { body, param } = require("express-validator");
const { validateResults, noExistId } = require("./_index");
const { messages, expressions } = require("#H/utils");
const Personal = require("#M/personal.model");
const Asistencia = require("#M/asistencia.model");
const { PARAMS_TIPO_ASISTENCIA_ENDPOINT } = require("#H/vars");

exports.validate_create_asistencia = [
  body("asistio")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("asistio"))
    .bail()
    .isBoolean()
    .withMessage(messages.CAMPO_INCORRECT("asistio"))
    .bail(),
  body("numDiaAsis")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("dia asistencia"))
    .bail()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("dia asistencia"))
    .bail(),
  body("activo")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("activo"))
    .bail()
    .isBoolean()
    .withMessage(messages.CAMPO_INCORRECT("activo"))
    .bail(),
  body("fechaAsistencia")
    .exists()
    .notEmpty()
    .isString()
    .matches(expressions.FECHA)
    .withMessage("Formato de fecha asistencia incorrecto"),
  body("observacionReporte")
    .optional({ values: "null" })
    .notEmpty()
    .isString()
    .trim()
    .withMessage(messages.CAMPO_INCORRECT("observacion reporte")),
  body("id_personal")
    .exists()
    .notEmpty()
    .isInt()
    .withMessage(messages.CAMPO_INCORRECT("personal"))
    .bail()
    .custom(noExistId(Personal, "No existe registro personal")),
  validateResults(),
];

exports.validate_update_asistencia = [
  param("idAsistencia")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("asistencia id"))
    .bail()
    .custom(noExistId(Asistencia, "No existe registro asistencia")),
  body("asistio")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("asistio"))
    .bail()
    .isBoolean()
    .withMessage(messages.CAMPO_INCORRECT("asistio"))
    .bail(),
  body("activo")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("activo"))
    .bail()
    .isBoolean()
    .withMessage(messages.CAMPO_INCORRECT("activo"))
    .bail(),
  body("fechaAsistencia")
    .exists()
    .notEmpty()
    .isString()
    .matches(expressions.FECHA)
    .withMessage("Formato de fecha asistencia incorrecto"),
  body("observacionReporte")
    .optional({ values: "null" })
    .notEmpty()
    .isString()
    .trim()
    .withMessage(messages.CAMPO_INCORRECT("observacion reporte")),
  body("id_personal")
    .exists()
    .notEmpty()
    .isInt()
    .withMessage(messages.CAMPO_INCORRECT("personal"))
    .bail()
    .custom(noExistId(Personal, "No existe registro personal")),
  validateResults(),
];

exports.validate_show_asistencia = [
  param("idAsistencia")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("asistencia id"))
    .bail()
    .custom(noExistId(Asistencia, "No existe registro asistencia")),
  validateResults(),
];

exports.validate_list_asistencia = [
  param("tipo")
    .optional({ values: "null" })
    .notEmpty()
    .isString()
    .isIn(Object.values(PARAMS_TIPO_ASISTENCIA_ENDPOINT))
    .withMessage(messages.VALUE_INVALID("tipo param")),
  validateResults(),
];
