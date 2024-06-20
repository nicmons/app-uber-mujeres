const { body, param } = require("express-validator");
const { messages, expressions } = require("#H/utils");
const {
  verifyActiveSesion,
  verifyPasswordIncrease,
  customValidationLogin,
  validatePerfilUsuarioLogin,
  registerSession,
  validateLogoutUser,
  validateUpdatePassword,
} = require("./index");
const { validateResults, noExistId } = require("#MW/_index");
const Usuario = require("#M/usuario.model");

exports.valid_user_passw_login = [
  body("contrasenna")
    .exists()
    .notEmpty()
    .withMessage(messages.NOT_SEND_VALUE("una contraseña"))
    .isString()
    .isLength({ min: 5 })
    .withMessage(messages.MIN_LENGTH("la contraseña", 5))
    .bail(),
  body("usuario")
    .exists()
    .notEmpty()
    .withMessage(messages.NOT_SEND_VALUE("usuario"))
    .bail()
    .custom(customValidationLogin)
    .bail(),
  body("perfil_id")
    .exists()
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.NOT_SEND_VALUE("perfil")),
  validateResults(),
  verifyPasswordIncrease,
  verifyActiveSesion,
  validatePerfilUsuarioLogin,
  registerSession,
];

exports.valid_logout = [
  param("idUsuario")
    .optional({ values: "null" })
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("usuario id"))
    .bail()
    .custom(noExistId(Usuario, "no existe usuario"))
    .bail(),
  validateResults(),
  validateLogoutUser,
];

exports.valid_update_pass = [
  param("idUsuario")
    .exists()
    .notEmpty()
    .isInt()
    .withMessage(messages.CAMPO_REQUERIDO("id usuario"))
    .bail()
    .custom(noExistId(Usuario, "No existe registro id usuario"))
    .bail(),
  body("oldContrasenna")
    .exists()
    .notEmpty()
    .withMessage(messages.PASS_NO_SEND)
    .bail(),
  body("newContrasenna")
    .exists()
    .notEmpty()
    .isString()
    .withMessage(messages.PASS_NEW_NO_SEND)
    .bail()
    .isLength({ min: 8 })
    .withMessage(messages.MIN_LENGTH("La contraseña", 8))
    .bail()
    .custom((value) => {
      if (!expressions.NO_STRINGSPACES.test(value)) {
        throw new Error(
          "La contraseña no debe contener espacios en ninguna parte"
        );
      }
      return true;
    })
    .matches(expressions.PASSWORDS)
    .withMessage(messages.PASS_NOT_SECURE)
    .bail(),
  validateResults(),
  validateUpdatePassword,
];
