const Config = require("#SRC/config/index");
const jwt = require("jsonwebtoken");
const { findUser } = require("./customQueries");
const { decryptValue } = require("./functions");
const Sesion = require("#M/sesion.model");
const { messages } = require("./utils");

exports.validateAuthorization = (authorization) => {
  if (authorization === Config.autorization) return { valid: true };
  return { valid: false, message: "No authorized" };
};

exports.validateToken = async (token) => {
  if (!token)
    return {
      valid: false,
      type: 0,
      message: "Token must be provided...",
    };

  return await jwt.verify(token, Config.jwtSecretKey, async (err, decoded) => {
    if (err) return { valid: false, type: 1, message: err.message };

    const { _sub: idUsuario } = decoded;
    const user = await findUser({ idUsuario }, ["contrasenna"]);

    /**validar si id de usuario segun token de usuario existe o esta activo en la db */
    if (!user)
      return {
        valid: false,
        type: 2,
        message: "usuario token no existe en la db",
      };
    if (!user?.activo)
      return {
        valid: false,
        type: 3,
        message: "usuario token no activo",
      };

    /** validar si el token proveido es el mismo de la db*/
    const tokenDecrypted = user.token ? await decryptValue(user.token) : "";
    if (tokenDecrypted !== token)
      return {
        valid: false,
        type: 4,
        message:
          "token no valido o no corresponde al usuario, inicie sesion nuevamente",
      };

    /**
     * validar si el id de usuario segun token de usuario es el mismo que el id de usuario que
     * se envia en la peticion
     */
    if (user?.idUsuario !== idUsuario)
      return {
        valid: false,
        type: 5,
        message: "token id no corresponde a usuario id",
      };

    /* Este código comprueba si el usuario asociado al token ha iniciado sesión. Consulta
        el modelo `Sesion` para encontrar una sesión en la que el `id_usuario` (ID de usuario) coincida con el valor `_sub`
        del token decodificado y el campo `activo` tenga el valor `true`.
        Si no se encuentra una sesión activa, devuelve una respuesta de error HTTP indicando que
        el usuario no está autorizado.*/
    const isLogged = await Sesion.findOne({
      where: { id_usuario: idUsuario, activo: true },
    });
    if (!isLogged)
      return {
        valid: false,
        type: 6,
        message: `${messages.UNAUTHORIZED} unlogged`,
      };
    return {
      valid: true,
      data: { ...user },
      decodedToken: decoded,
    };
  });
};
