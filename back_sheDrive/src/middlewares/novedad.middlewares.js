const { body, param, query } = require("express-validator");
const { validateResults, noExistId } = require("./_index");
const { messages } = require("#H/utils");
const { PARAMS_TIPOS_NOVEDAD_ENDPOINT } = require("#H/vars");
const TipoNovedad = require("#M/tipoNovedad.model");
const ReporteNovedad = require("#M/reporteNovedad.model");

exports.validate_create_novedad = [
  body("id_tipoNovedad")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("id tipoNovedad"))
    .bail()
    .custom(noExistId(TipoNovedad, "No existe registro novedad")),
  body("observacionNovedad")
    .optional({ values: "null" })
    .notEmpty()
    .isString()
    .withMessage(messages.CAMPO_REQUERIDO("Observacion de la novedad"))
    .bail()
    .isLength({ max: 255 })
    .withMessage(messages.MAX_LENGTH("Observacion de la novedad", 255))
    .bail(),
  body("observacionreporte")
    .optional({ values: "null" })
    .notEmpty()
    .isString()
    .withMessage(messages.CAMPO_REQUERIDO("Observacion reporte"))
    .bail()
    .isLength({ max: 255 })
    .withMessage(messages.MAX_LENGTH("Observacion reporte", 255))
    .bail(),
  body("adjuntoNovedad")
    .optional({ values: "null" })
    .notEmpty()
    .isBoolean()
    .withMessage(messages.CAMPO_INCORRECT("adjunto novedad"))
    .bail(),
  body("numDiaAsis")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("dia asistencia"))
    .bail(),
  body("fechaInicioNovedad").exists().notEmpty(),
  validateResults(),
];

exports.validate_list = [
  param("tipo")
    .optional({ values: "null" })
    .notEmpty()
    .isString()
    .isIn([
      // rrhh
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.CHECKNOMINA,
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.AVAL,
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.HISTORICO,
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.CREAR,
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.LISTA,
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.REINTEGRAR,
      // responsable
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.PENDIENTES,
      // admin
      PARAMS_TIPOS_NOVEDAD_ENDPOINT.APROBACION,
    ])
    .withMessage(messages.CAMPO_INCORRECT("param tipo invalido"))
    .bail(),
  query("fechaInicioNovedad")
    .optional({ values: "null" })
    .isString()
    .withMessage(messages.CAMPO_INCORRECT("fechaInicioNovedad"))
    .bail(),
  query("fechaFinNovedad")
    .optional({ values: "null" })
    .isString()
    .withMessage(messages.CAMPO_INCORRECT("fechaFinNovedad"))
    .bail(),
  query("estado")
    .optional({ values: "null" })
    .isString()
    .withMessage(messages.CAMPO_INCORRECT("estado"))
    .bail(),
  query("tipoNovedad")
    .optional({ values: "null" })
    .isString()
    .withMessage(messages.CAMPO_INCORRECT("tipoNovedad"))
    .bail(),
  query("supervisor")
    .optional({ values: "null" })
    .isString()
    .withMessage(messages.CAMPO_INCORRECT("tipoNovedad"))
    .bail(),
  query("numDocumento")
    .optional({ values: "null" })
    .isString()
    .withMessage(messages.CAMPO_INCORRECT("tipoNovedad"))
    .bail(),
  query("fechaReporte")
    .optional({ values: "null" })
    .isString()
    .withMessage(messages.CAMPO_INCORRECT("tipoNovedad"))
    .bail(),
  validateResults(),
];

exports.validate_update_novedad = [
  param("idReporteNovedad")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("reporte de novedad")),
  validateResults(),
];

exports.validate_gestionar_novedad = [
  param("tipo")
    .exists()
    .notEmpty()
    .withMessage(messages.CAMPO_REQUERIDO("se debe especificar el tipo"))
    .bail(),
  query("idReporteNovedad")
    .exists()
    .notEmpty()
    .custom(
      noExistId(
        ReporteNovedad,
        "No existe registro id reporte novedad",
        {},
        false
      )
    )
    .withMessage(messages.CAMPO_REQUERIDO("id ReporteNovedad"))
    .bail(),
  body("id_tipoNovedad")
    .optional({ values: "null" })
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("id id_tipoNovedad"))
    .bail(),
  body("aprobado")
    .optional({ values: "null" })
    .notEmpty()
    .isString()
    .isIn(["true", "false"])
    .withMessage(messages.CAMPO_INCORRECT("aprobado")),
  validateResults(),
];
