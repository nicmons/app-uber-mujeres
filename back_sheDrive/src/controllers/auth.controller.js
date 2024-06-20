const { httpError, httpSend } = require("#H/httpResponses");
const {
  getCurrentStringDate,
  generatorToken,
  encryptValue,
  decryptValue,
  addTokenData,
  hashValue,
} = require("#H/functions");
const sequelize = require("#DB/sequelize");
const Perfil = require("#M/perfil.model");
const { lays } = require("#H/vars");
const { cerrarSesion } = require("#H/customQueries");
const { messages } = require("#H/utils");
const Usuario = require("#M/usuario.model");

exports.login = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userTryLogin: usuario, sesion } = req;
    const { perfil_id, empresa_id } = req.body;
    const { idUsuario, token, cambiarContrasenna } = usuario;

    /* Este bloque de código actualiza el registro de sesión en la base de datos. Establece el campo `activo` a
     * `true`, actualiza el campo `fechaSesion` con la fecha actual, y establece el campo `intentos` a 0
     */
    try {
      sesion.activo = true;
      sesion.fechaSesion = getCurrentStringDate();
      await sesion.save({ transaction: t });
    } catch (error) {
      throw new Error(`PUT session error ${error.message}`);
    }

    const perfilCode = await Perfil.findByPk(perfil_id, {
      attributes: ["strCode"],
      raw: true,
      transaction: t,
    });
    /* generar nuevo token de usuario en caso que no tenga, o que este vencido o tenga error (ver customValidationLogin) */
    let tokenUsuario = token;
    if (!tokenUsuario) {
      tokenUsuario = generatorToken(
        { _sub: idUsuario },
        cambiarContrasenna ? "6h" : "30d"
      );
    } else tokenUsuario = await decryptValue(token);

    const tokenUpdated = await addTokenData(tokenUsuario, {
      lay: lays[perfilCode.strCode],
    });

    const tokenEncrited = encryptValue(tokenUpdated);
    usuario.token = tokenEncrited;
    await usuario.save({ transaction: t });

    await t.commit();
    httpSend(res, { tkn: tokenEncrited }, "bienvenido");
  } catch (error) {
    await t.rollback();
    httpError(res, `Error inicio de sesión ${error?.message}`, 403);
  }
};

exports.logout = async (req, res) => {
  try {
    const idUsuario = req.logoutId;
    const close = await cerrarSesion(idUsuario, getCurrentStringDate());
    await Usuario.update({ intentosLogin: 0 }, { where: { idUsuario } });
    return close
      ? httpSend(res, undefined, "success logout")
      : httpSend(res, undefined, "usuario no tiene sesiones activas");
  } catch (error) {
    httpError(res, `${messages.LOGOUT_ERROR_SAVE}: ${error?.message}`);
  }
};

/**
 * Este código exporta una función llamada updatePassword que se utiliza para actualizar la contraseña de un usuario.
 * Recibe un objeto de solicitud (req) y un objeto de respuesta (res) como entradas.
 * La función recupera el ID del usuario y la nueva contraseña del objeto de solicitud, cifra la nueva contraseña y actualiza la contraseña del usuario en la base de datos.
 * También cierra la sesión del usuario y envía un mensaje de éxito en la respuesta.
 * @param {*} req
 * @param {*} res
 */
exports.updatePassword = async (req, res) => {
  try {
    const { idUsuario: id_usuario } = req.params;
    const { newContrasenna } = req.userTryUpdatePassword;
    /**encript new password and send data */
    const contrasenna = hashValue(newContrasenna);

    await Usuario.update(
      { contrasenna, token: null, cambiarContrasenna: false },
      { where: { idUsuario: id_usuario } }
    );
    await cerrarSesion(id_usuario, getCurrentStringDate());
    httpSend(res, undefined, messages.PASS_UPT_CORRECT);
  } catch (error) {
    httpError(res, error.message, 400);
  }
};
