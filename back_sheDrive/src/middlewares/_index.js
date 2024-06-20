const { validationResult } = require("express-validator");
const { httpError } = require("#H/httpResponses");
const { publicRoutesPaths } = require("#H/utils");
const { validateToken, validateAuthorization } = require("#H/validUseaAPP");
const { decryptValue } = require("#H/functions");

exports.validAutorization = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const { path } = req;
    const nexteds = publicRoutesPaths.slice(1);
    if (nexteds.some((el) => path.includes(el))) return next();

    const checkAuthorization = validateAuthorization(authorization);
    if (!checkAuthorization.valid) {
      return httpError(
        res,
        checkAuthorization.message + ` ${req.useragent.source}`
      );
    }
    next();
  } catch (error) {
    httpError(
      res,
      `nauthorized validAutorization error:: ${error.message}`,
      error.code
    );
  }
};

exports.setReqGlobalsData = (req, res, next) => {
  try {
    /* El código está recuperando la dirección IP del cliente que realiza la solicitud
      y la asigna a la request object. */
    const getIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const IP = getIp?.includes("::ffff:") ? getIp.split("::ffff:")[1] : getIp;
    req.getIp = {
      IP,
    };
    /* Estas líneas de código extraen información sobre el navegador, el sistema operativo y
     * la plataforma del usuario a partir del objeto `req.useragent`. */
    const browserId = req.cookies.browserId ?? "no-cook";
    const { browser, os, platform } = req.useragent;
    const clientAgent = `${browser}_${os}_${platform}`.replace(/\s/g, "");

    /* El código `global.mainGlobals` está asignando un objeto a la variable global
        mainGlobals`. Este objeto contiene información sobre la operación del usuario,
        como la dirección IP del usuario (`ipUsuarioOperacion`), el ID del usuario (`idUsuarioOperacion`), y el tipo de
        de operación que se está realizando (`tipoOperacion`).
        El tipo de operación se determina en función de el método HTTP de la petición (`req.method`).
        Esta variable puede ser accedida y utilizada en otras partes del código.
        */
    global.mainGlobals = {
      ipUsuarioOperacion: IP,
      clientAgent,
      browserId,
      tipoOperacion: req.method,
    };

    next();
  } catch (error) {
    console.log("error:: setReqGlobalsData ", error.message);
  }
};

/**
 * a excepcion del edpoinnt para autenticacion de usuario, esta funcion permite validar la autenticidad del token
 * (expiracion y secretkey), que el usuario recibido en el token exista y que se ecuentre activo.
 */
exports.validToken = async (req, res, next) => {
  // el token debe enviarse encryptado
  const { path } = req;
  const nexteds = publicRoutesPaths;
  if (nexteds.some((el) => path.includes(el))) return next();

  const token = await decryptValue(req.headers["tk"]);
  try {
    const checkToken = await validateToken(token);
    if (!checkToken.valid) {
      switch (checkToken.type) {
        case 1:
        case 4:
          return httpError(res, checkToken.message);
        case 2:
        case 3:
        case 5:
        case 6:
          return httpError(res, checkToken.message, 404);
        default:
          return httpError(res, checkToken.message, 401);
      }
    }
    /* `req.userToken` es un objeto que se asigna a la propiedad `userToken` del objeto `req.
     * Contiene información sobre el usuario extraída del token decodificado.
     */
    const user = checkToken.data;
    const tokenDecodeduser = checkToken.decodedToken;

    req.userToken = { ...user?.dataValues, tokenDecodeduser };
    global.mainGlobals = {
      ...global.mainGlobals,
      idUsuarioOperacion: user.idUsuario,
    };

    next();
  } catch (error) {
    httpError(res, error.message, 401);
  }
};

/**
 * La función valida los resultados de una petición y lanza un error
 * si la validación falla.
 */
exports.validateResults = (validInArray = undefined) => {
  return (req, res, next) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (error) {
      /* La variable `errorMessage` se utiliza para generar un mensaje de error basado en los errores de validación
        devueltos por la función `validationResult`. */
      const errorMessage = validInArray
        ? /* ? error.array().find((err) => Array.isArray(err.value))?.msg*/
          error.array().at(0)?.msg || "error en validacion de campos Arr"
        : `${error.array().at(-1)?.msg}` || "error en validacion de campos";

      httpError(res, errorMessage);
    }
  };
};

/**
 * Este código define una función llamada noExistId que se utiliza para comprobar si
 * existe un registro con un valor específico en una tabla de la base de datos.
 * También incluye una función opcional para incluir datos relacionados adicionales en la respuesta.
 * Si el registro no existe, se lanza un error.
 * La función actualiza el objeto de solicitud con el registro encontrado si se proporciona el parámetro includeRespInReq.
 * @param {*} Model - El modelo de Sequelize para consultar la existencia de un valor.
 * @param {*} msg
 * @param {*} includeRespInReq? - incluye datos relacionados adicionales en la respuesta.
 * @returns {void}
 * ejemplo de uso:
 * [body("primaryKey")
    .optional({ values: "null" })
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage(messages.CAMPO_INCORRECT("id primarikey"))
    .bail()
    .custom(
      noExistId(Periodicidad, "No existe registro id periodicidad", {
        includes: [{ model: GeneracionAutomatica }],
      })
    )
    .bail()]
 */
exports.noExistId = (
  Model,
  msg,
  includeRespInReq,
  raw = true,
  validateActivo = false
) => {
  return async (value, { req }) => {
    try {
      const pk = Model.primaryKeyAttribute;
      const exist = await Model.findOne({
        raw: raw,
        where: validateActivo ? { [pk]: value, activo: true } : { [pk]: value },
        include:
          includeRespInReq && includeRespInReq.include
            ? includeRespInReq.include
            : undefined,
      });
      if (!exist) {
        throw new Error(`${msg}`);
      }

      if (includeRespInReq)
        Object.assign(req, {
          [`_${Model.name}`]: exist,
        });
    } catch (error) {
      throw new Error(`error:: noExistId ${value} :: ${error.message}`);
    }
  };
};
