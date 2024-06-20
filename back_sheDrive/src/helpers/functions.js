const jwt = require("jsonwebtoken");
const Crypto = require("crypto-js");
const bcrypt = require("bcryptjs");
const Config = require("#SRC/config/index");
const { isAsyncFunction } = require("util/types");
const path = require("path");
const {
  PARAMS_TIPOS_NOVEDAD_ENDPOINT,
  PARAMS_TIPO_ASISTENCIA_ENDPOINT,
} = require("./vars");
const {
  getNovedadesAval,
  getHistoricoNovedad,
  getAsistenciasPersonal,
  getAllNovedades,
  getNovedadesCrear,
  getNovedadesLista,
  getNovedadesPendientes,
  getNovedadesAprobacion,
  getNovedadesCheckNomina,
  getNovedadesReintegrar,
  getAsistenciasPersonalControl,
  getAsistenciasReporte,
} = require("./customQueries");
const HoliDays = require("date-holidays");
const {
  quitarTildes,
  convertirFechaAHoraColombiana,
  getFechaColombia,
} = require("./utils");
const hd = new HoliDays("CO");

/**
 * esta funcion valida que el archivo cumpla con las validaciones
 * @param {string} field - El nombre del campo que contiene el archivo.
 * @param {string[]} extensions - Las extensiones de archivo permitidas.
 * @param {Object} file - El objeto de archivo proporcionado por el middleware de carga de archivos.
 * @param {Function} cb - La función de devolución de llamada proporcionada por el middleware de carga de archivos.
 * @param {Object} req - El objeto de solicitud proporcionado por el middleware de carga de archivos.
 * @param {Function} bodyValitations - La función de validación del cuerpo proporcionada por el middleware de carga de archivos.
 */
exports.fileValidations = async ({
  field,
  extensions,
  file,
  cb,
  req,
  bodyValitations = undefined,
}) => {
  // verificar que se proporcione archivo
  if (!field) {
    return cb(new Error("Field no proporcionado"));
  }
  // si la extension no es valida retorna error
  const fileExtension = path.extname(file.originalname);
  if (extensions && !extensions.includes(fileExtension)) {
    return cb(new Error("Extensión de archivo no válida."));
  }

  if (bodyValitations) {
    isAsyncFunction(bodyValitations)
      ? await bodyValitations(req, cb)
      : bodyValitations(req, cb);
  } else {
    cb(null, true);
  }
};

/**
 * Esta función genera un JSON Web Token con un payload y un tiempo de expiración dados.
 * @param payload - El payload son los datos que se codificarán en el JWT (JSON Web Token). Puede ser
 * ser cualquier objeto JSON que quieras incluir en el token, como información de usuario o detalles de autorización.
 * detalles.
 * @param [expiresIn=30d] - El parámetro expiresIn es un parámetro opcional que especifica el tiempo
 * duración después de la cual expirará el token generado..
 */
exports.generatorToken = (payload, expiresIn = "30d") => {
  return jwt.sign(payload, Config.jwtSecretKey, {
    expiresIn,
  });
};
exports.addTokenData = async (token, newValues) => {
  let decodedData = null;
  await jwt.verify(token, Config.jwtSecretKey, (err, decoded) => {
    if (err) throw new Error("token data error");
    decodedData = decoded;
  });
  return jwt.sign({ ...decodedData, ...newValues }, Config.jwtSecretKey);
};

exports.getCurrentStringDate = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  return new Date(now.getTime() - timezoneOffset).toISOString();
};

exports.getCurrentDate = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  return new Date(now.getTime() - timezoneOffset);
};
exports.getNumCurrentDay = () => {
  const fecha = new Date().toLocaleString("es-CO");
  const fechaArr = fecha.split("/");
  return Number(fechaArr[0]);
};

/**
 * La función descifra un valor utilizando el cifrado DES y una clave secreta.
 * @param enncriptValue - El parámetro "enncriptValue" es probablemente una cadena que representa un valor encriptado que
 * necesita ser descifrado.
 */
exports.decryptValue = async (enncriptValue) => {
  try {
    const bytes = Crypto.DES.decrypt(enncriptValue, Config.secretKeyEnCrypt);
    return bytes.toString(Crypto.enc.Utf8);
  } catch (error) {
    throw new Error(`error:: decryptValue ${error.message}`);
  }
};

/**
 * La función hashValue utiliza bcrypt para generar una sal y un hash de una cadena dada.
 * @param string - La cadena que necesita ser encriptada.
 * @devuelve La función `hashValue` devuelve una versión con hash y sal de la cadena de entrada
 * usando la librería `bcrypt`
 */
exports.hashValue = (string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(string, salt);
};

/**
 * Esta función compara un valor de texto plano con su versión cifrada utilizando bcrypt.
 * @param string - El texto plano que necesita ser comparada con la contraseña hash.
 * @param hash - El parámetro `hash` es una cadena con hash que ha sido previamente
 * generado usando un algoritmo criptográfico como bcrypt.
 */
exports.compareHash = (string, hash) => {
  try {
    return bcrypt.compare(string, hash);
  } catch (error) {
    throw new Error("Error comparing hash: " + error.message);
  }
};
exports.decodedToken = (token) => {
  return jwt.decode(token, Config.jwtSecretKey);
};

exports.getErrorToken = async (token, secretKey) => {
  try {
    let error = false;
    await jwt.verify(token, secretKey, (err) => {
      if (err) {
        error = true;
        return { error };
      }
    });
    return { error };
  } catch (error) {
    return { error: true };
  }
};

/* La función encripta un valor dado utilizando encriptación DES con una clave secreta.
 * @param value - El value es la cadena de entrada que necesita ser encriptada usando el algoritmo de encriptación DES.
 */
exports.encryptValue = (value) => {
  return Crypto.DES.encrypt(value, Config.secretKeyEnCrypt).toString();
};

exports.getColumsSaredLogs = (seq) => {
  return {
    id: {
      type: seq.DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    IDTHIS: {
      type: seq.DataTypes.BIGINT,
      allowNull: false,
    },
    browserId: {
      type: seq.DataTypes.STRING,
      allowNull: true,
    },
    ipUsuarioOperacion: {
      type: seq.DataTypes.STRING(60),
      allowNull: true,
    },
    idUsuarioOperacion: {
      type: seq.DataTypes.BIGINT,
      allowNull: true,
    },
    clientAgent: {
      type: seq.DataTypes.STRING,
      allowNull: true,
    },
    tipoOperacion: {
      type: seq.DataTypes.STRING(20),
      allowNull: true,
    },
    createdAt: {
      type: seq.DataTypes.DATE,
      allowNull: true,
      defaultValue: seq.literal("CURRENT_TIMESTAMP"),
      field: "createdAt",
    },
  };
};

exports.getFirstCaracteres = (string, numCaracters = 3) => {
  if (typeof string !== "string" || string.trim().length === 3) return string;
  return string.trim().replace(/\s+/g, "").slice(0, numCaracters);
};

exports.quitarEspaciosExtras = (string) => {
  if (typeof string !== "string") return "";
  return string.trim().replace(/\s+/g, " ");
};

exports.IsEqualValue = (valueOne, valueTwo) => valueOne === valueTwo;

/**
 * Esta función exports.getNovedadesByTipo se utiliza para recuperar una lista de novedades según el tipo dado.
 * Llama a diferentes funciones auxiliares según el parámetro de tipo y devuelve la respuesta obtenida de la función auxiliar correspondiente.
 * @param {*} tipo
 * @param {*} querys
 * @param {*} tokenDecodeduser
 * @returns
 */
exports.getNovedadesByTipo = async (tipo, querys, tokenDecodeduser) => {
  let resp = [];
  try {
    switch (tipo) {
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.CHECKNOMINA:
        resp = await getNovedadesCheckNomina(querys);
        break;
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.AVAL:
        resp = await getNovedadesAval(querys);
        break;
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.HISTORICO:
        resp = await getHistoricoNovedad(querys);
        break;
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.CREAR:
        resp = await getNovedadesCrear(querys);
        break;
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.LISTA:
        resp = await getNovedadesLista(querys);
        break;
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.REINTEGRAR:
        resp = await getNovedadesReintegrar(querys);
        break;
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.PENDIENTES:
        resp = await getNovedadesPendientes(tokenDecodeduser);
        break;
      case PARAMS_TIPOS_NOVEDAD_ENDPOINT.APROBACION:
        resp = await getNovedadesAprobacion(querys);
        break;
      default:
        resp = await getAllNovedades(tokenDecodeduser);
        break;
    }
    return resp;
  } catch (error) {
    return { error: true, message: error?.message };
  }
};

exports.getAsistenciasByTipo = async (req, { fechas }) => {
  try {
    const { numDocumento, tokenDecodeduser } = req.userToken;
    const { tipo } = req.params;
    const { query } = req;

    let resp = null;
    switch (tipo) {
      case PARAMS_TIPO_ASISTENCIA_ENDPOINT.PERSONAL:
        resp = await getAsistenciasPersonal(
          tokenDecodeduser,
          numDocumento,
          fechas?.personal
        );
        break;
      case PARAMS_TIPO_ASISTENCIA_ENDPOINT.CONTROL:
        {
          resp = await getAsistenciasPersonalControl(query, fechas?.control);
        }
        break;
      case PARAMS_TIPO_ASISTENCIA_ENDPOINT.REPORTE:
        {
          resp = await getAsistenciasReporte(query);
        }
        break;
      default:
        resp = await Asistencia.findAll();
        break;
    }
    return resp;
  } catch (error) {
    throw new Error(error?.message);
  }
};

/** La función llamada esDia que comprueba si un día determinado está incluido en una lista de días.
 *  Recibe dos parámetros: días, que es una matriz de días, y fecha que es opcional,
 *  si no se pasa tomara la fecha actual
 */
exports.esDia = (dias, fecha) => {
  const diaSemana = fecha
    ? convertirFechaAHoraColombiana(fecha)
    : getFechaColombia()
        .toLocaleDateString("es-CO", { weekday: "long" })
        .toLowerCase();
  return dias.includes(quitarTildes(diaSemana));
};

/* pasar la fecha en formato YYYY-MM-DD ("2024-05-01")*/
exports.isFeriado = (fecha) => {
  const date = new Date(fecha);
  const festivos = hd.getHolidays(date.getFullYear());
  return festivos.some((festivo) => festivo?.date.includes(fecha));
};

exports.getRootDirName = (stringPath) => {
  return path.join(__dirname, stringPath);
};
