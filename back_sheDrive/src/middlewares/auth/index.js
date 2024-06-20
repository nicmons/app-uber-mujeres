const { httpError } = require("#H/httpResponses");
const {
  compareHash,
  getCurrentStringDate,
  decodedToken,
  getErrorToken,
  decryptValue,
} = require("#H/functions");
const { messages } = require("#H/utils");
const Sesion = require("#M/sesion.model");
const { findUser } = require("#H/customQueries");
// const { validatePlatformAuthByUser } = require("#H/validateData");
const Usuario = require("#M/usuario.model");
const Perfil = require("#M/perfil.model");
const Config = require("#SRC/config/index");
const sequelize = require("#DB/sequelize");
const { strCodesPerfil, lays } = require("#H/vars");

/**
 * El objetivo de la función es verificar la contraseña recibida con la contraseña del usuario,
 * aumentar los intentos de sesión si la contraseña es incorrecta y devolver un mensaje de error
 * si los intentos superan el límite establecido en la configuración.
 * FLOW:
 * 1. Obtener la contraseña recibida y la contraseña del usuario del objeto de solicitud.
 * 2. Obtener el id del usuario, la IP del cliente y la información del dispositivo del objeto request.
 * 3. Buscar o crear una sesión para el usuario con la información obtenida.
 * 4. Comparar la contraseña recibida con la contraseña del usuario utilizando la función compareHash.
 * 5. Si las contraseñas no coinciden, aumentar los intentos de sesión y devolver un mensaje de error con los intentos restantes.
 * 6. Si los intentos de sesión superan el límite establecido en la configuración, aumentar los intentos de sesión y devolver un mensaje de error.
 * 7. Si las contraseñas coinciden y los intentos de sesión están dentro del límite, llame a la siguiente función del middleware.
 */
exports.verifyPasswordIncrease = async (req, res, next) => {
  const INTENTOSLOGIN = 4;
  try {
    const usuario = req.userTryLogin;
    const { contrasenna: receivedPassword } = req.body;
    const { contrasenna: userPassword } = usuario;

    /**validar passw */
    const matchPassword = await compareHash(receivedPassword, userPassword);
    if (!matchPassword) {
      await increaseUser_IntentosLogin(usuario);
      const restante = INTENTOSLOGIN - Number(usuario?.intentosLogin);
      throw new Error(
        restante <= 0
          ? `${messages.SUPERA_INTENTOS}`
          : `${messages.PASS_NO_VALID} ${messages.REST_INTENTOS}: ${restante}`
      );
    }
    if (usuario?.intentosLogin >= INTENTOSLOGIN) {
      await increaseUser_IntentosLogin(usuario);
      throw new Error(messages.SUPERA_INTENTOS);
    }
    next();
  } catch (error) {
    return httpError(res, error.message);
  }
};

/**
 * El objetivo de la función es verificar si hay una sesión activa para un usuario dado.
 * Si hay una sesión activa, devuelve un mensaje de error; en caso contrario,
 * llama a la siguiente función del middleware.
 * FLOW:
 * 1. Extraer el id del usuario del objeto de petición.
 * 2. Consultar la base de datos para encontrar una sesión activa para el usuario.
 * 3. Si se encuentra una sesión activa, devolver un mensaje de error utilizando la función httpError.
 * 4. Si no se encuentra ninguna sesión activa, llame a la siguiente función del middleware.
 */
exports.verifyActiveSesion = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { idUsuario: id_usuario } = req.userTryLogin;

    const session = await Sesion.findOne({
      where: { id_usuario, activo: true },
      raw: true,
      transaction: t,
    });

    if (session) {
      const SESSION_ERROR_MESSAGE = `${messages.USER_LOGUEADO} ${
        session?.equipo || ""
      }`;
      await t.rollback();
      return httpError(res, SESSION_ERROR_MESSAGE);
    }
    next();
  } catch (error) {
    await t.rollback();
    return httpError(res, `${error.message}`);
  }
};

/*
 * Esta función valida una solicitud de actualización de contraseña comprobando si la contraseña
 * antigua coincide con la contraseña actual del usuario.
 * El flujo principal de la función es el siguiente:
 * 1. Desestructurar el id, oldContrasenna, y newContrasenna del cuerpo de la petición.
 * 2. Llamar a la función findUser para obtener el objeto usuario de la base de datos.
 * 3. Compara la contraseña antigua con la contraseña actual del usuario utilizando la función compareHash.
 * 4. Si las contraseñas no coinciden, devuelva una respuesta de error utilizando la función httpError.
 * 5. Establece el objeto usuario con la nueva contraseña y elimina la contraseña actual del objeto.
 * 6. Llame a la siguiente función del middleware.
 */
exports.validateUpdatePassword = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const { oldContrasenna, newContrasenna } = req.body;

    if (newContrasenna === oldContrasenna)
      return httpError(
        res,
        "La nueva contraseña debe ser diferente a la actual"
      );

    const user = await findUser({ idUsuario }, ["token"]);
    const matchPass = await compareHash(oldContrasenna, user.contrasenna);

    if (!matchPass) return httpError(res, messages.PASS_OLD_NO_CORRECT);

    req.userTryUpdatePassword = {
      ...user,
      newContrasenna,
      contrasenna: undefined,
    };
    next();
  } catch (error) {
    httpError(res, error.message);
  }
};

/**
 * Este código define una función llamada validateLogoutUser que se utiliza para
 * validar el proceso de cierre de sesión de un usuario.
 * Comprueba si el token proporcionado en la cabecera de la solicitud coincide con el token
 * almacenado en el registro de la base de datos del usuario.
 * También verifica si el usuario está activo y si el ID de usuario en el token coincide
 * con el ID de usuario solicitado.
 */
exports.validateLogoutUser = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const { tk: tokenHeader } = req.headers;

    if (!tokenHeader) throw new Error(`No set "token" value`);

    const token = await decryptValue(tokenHeader);
    const decodTkn = decodedToken(token);

    if (!decodTkn || !decodTkn?._sub) throw new Error("tkn error");
    if (idUsuario && decodTkn?.lay !== lays.ADMIN)
      throw new Error("no auth logout by usuario");

    req.logoutId = !idUsuario ? decodTkn?._sub : idUsuario;
    next();
  } catch (error) {
    httpError(res, `error:: ${error.message}`, 500);
  }
};

/**
 * Aumenta el número de intentos de una sesión.
 * @param {Object} usuario - El objeto de usuario a actualizar.
 * @param {number} [increment=1] - La cantidad a incrementar en el campo de intentos.
 * @throws {Error} Si se produce un error al actualizar la usuario.
 */
const increaseUser_IntentosLogin = async (usuario, t) => {
  try {
    usuario.intentosLogin += 1;
    t ? await usuario.save({ transaction: t }) : await usuario.save();
  } catch (error) {
    throw new Error(`Error increasing attempts: ${error.message}`);
  }
};

/**
 * El objetivo de esta función es actualizar el código OTP
 * (One-Time Password) y su tiempo de expiración en el objeto de sesión.
 */
// const updateOtpCode = async (session, otp, otpExpire) => {
//   try {
//     return await session.update({ otp: hashValue(otp), otpExpire });
//   } catch (error) {
//     throw new Error(`Error updating otp: ${error.message}`);
//   }
// };

/**
 * El objetivo de la función es actualizar un objeto de sesión
 * en la base de datos con nuevos valores para los campos 'activo', 'fechaSesion' e 'intentos'.
 */
exports.updateSession = async (session) => {
  try {
    session.activo = true;
    session.fechaSesion = getCurrentStringDate();
    await session.save();
  } catch (error) {
    throw new Error(`Error updating sesion: ${error.message}`);
  }
};

/**
 * Este código define una función llamada customValidationLogin
 * que realiza una validación personalizada para un proceso de inicio de sesión.
 * Comprueba si un usuario existe, si tiene un perfil asignado y si su perfil coincide con la plataforma.
 * También establece algunos valores en el objeto request y actualiza una variable global.
 */
exports.customValidationLogin = async (value, { req }) => {
  const t = await sequelize.transaction();
  try {
    const user = await Usuario.findOne({
      transaction: t,
      where: { usuario: value, activo: true },
    });
    if (!user) throw new Error(messages.DATA_NO_EXIST(`usuario ${value}`));

    if (user.token) {
      const tokenDecrypted = await decryptValue(user.token);
      const infoToken = await getErrorToken(
        tokenDecrypted,
        Config.jwtSecretKey
      );
      if (infoToken?.error) {
        user.token = null;
        user.cambiarContrasenna = true;
        await user.save({ transaction: t });
      }
    }
    await t.commit();
    req.userTryLogin = user;
    global.mainGlobals = {
      ...global.mainGlobals,
      idUsuarioOperacion: user?.idUsuario,
    };
  } catch (error) {
    await t.rollback();
    throw new Error(error?.message || "Error");
  }
};

exports.registerSession = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const ipSesion = req.ip;
    const { idUsuario: id_usuario } = req.userTryLogin;

    const [session, isNew] = await Sesion.findOrCreate({
      where: { id_usuario },
      defaults: {
        id_usuario,
        ipSesion,
      },
      transaction: t,
    });
    if (!isNew) {
      session.ipSesion = ipSesion;
      await session.save({ transaction: t });
    }
    await t.commit();
    req.sesion = session;
    next();
  } catch (error) {
    await t.rollback();
    return httpError(res, error.message);
  }
};

exports.validatePerfilUsuarioLogin = async (req, res, next) => {
  try {
    const { perfil_id, empresa_id } = req.body;
    const perfilResponsable = await Perfil.findOne({
      where: { strCode: strCodesPerfil.RESPONSABLE },
      raw: true,
      attributes: ["idPerfil"],
    });
    if (perfilResponsable?.idPerfil === perfil_id) {
      if (!empresa_id)
        return httpError(res, "se requiere seleccionar la empresa");
      req.body = { ...req.body, empresa_id };
    }
    next();
  } catch (error) {
    return httpError(res, `error: ${error?.message}`, 500);
  }
};
