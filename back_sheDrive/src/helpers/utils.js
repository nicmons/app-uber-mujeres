const {
  format,
  parseISO,
  eachDayOfInterval,
  getDate,
  addDays,
} = require("date-fns");
const { es } = require("date-fns/locale");

exports.generarStringAleatorio = ({ longitud = 8 } = {}) => {
  const caracteres =
    "ABCDEFGHKMNOPQRSTUVWXYZabcdefghkmnopqrstuvwxyz023456789*_";
  let resultado = "";
  for (let c = 0; c < longitud; c++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indiceAleatorio);
  }
  return resultado;
};

exports.publicRoutesPaths = ["auth", "info-login"];

exports.messages = {
  /**users */
  USER_NO_REGISTRADO: "No se encontro usuario registrado con este correo",
  USER_NO_EXISTE: "Usuario no existe en la base de datos",
  USER_CREADO: "Usuario creado correctamente",
  USER_DUPLICADO: (email) =>
    `Ya hay un usuario registrado con este email ${email}`,
  WELCOME_SESSION: "Bienvenido a tu cuenta",
  USER_LOGUEADO:
    "Ya existe una sesion activa en otro dispositivo, por favor cierra sesion e intenta nuevamente",
  ROL_UNAUTHORIZED: "No cuentas con el rol indicado para esta peticion",
  UNAUTHORIZED: "No autorizado",
  UNLOGGED: "Debes estar logueado",
  CAMPO_REQUERIDO: (campo) => `${campo} es requerido`,
  CAMPO_INCORRECT: (campo) => `${campo} es incorrecto`,
  CAMPO_VACIO: (campo) => `${campo} no debe enviarse vacio`,
  /**passwords - mails */
  PASS_MAIL_INCORRECTO: "Correo o contraseña incorrecto, verifica nuevamente",
  PASS_NO_MATCH: "Correo o contraseña no coinciden",
  PASS_OLD_NO_CORRECT: "Contraseña actual incorreacta",
  PASS_NO_VALID: "Contraseña invalida",
  PASS_NOT_SECURE:
    "La contraseña no cumple los requisitos minimos de seguridad",
  REST_INTENTOS: "intentos restantes",
  SUPERA_INTENTOS:
    "Has superado el limite de intentos, consulta con tu administrador",
  PASS_UPT_CORRECT:
    "Contraseña actualizada correctamente, inicia sesion nuevamente.",
  PASS_NO_SEND: "Es necesaria la contraseña actual",
  PASS_NEW_NO_SEND: "Es necesaria una nueva contraseña",
  LOGIN_ERROR: "Error en inicio de sesion, intenta nuevamante en unos minutos",
  LOGOUT_ERROR: "Se debe especificar un usuario",
  LOGOUT_ERROR_SAVE: "Error al cerrar la sesión, intente nuevamente",
  LOGOUT_CORRECT: "Cerrado de sesión exitoso",
  TOKEN_NO_SEND: "error tkn",
  NO_ACTIVE_SESION: "No hay sesiones activas para este usuario",
  // bad req
  ERR_SAVE: (value) =>
    `${value} no ha sido creado por un problema en la consulta`,
  ERR_GET: (value) => `Error obteniendo ${value || "información"}`,
  ERR_EDIT: (model) => `Error al actalizar ${model}`,
  ERR_DELETE: (model) => `Error al borrar ${model || ""}`,
  SUCCESS: "Success",
  TOKEN_INVALID: "Token invalido o expirado",
  NO_PARAM: (param) => `Debe especificar un ${param}`,
  INCOMPLETE_DATA: "Datos incompletos",
  // Globals
  DATA_DUPLICATED: (value) =>
    `ya existe un registro de ${value} previamente creado`,
  DATA_ELIMINADO: (model) => `${model || ""} eliminado correctamente`,
  DATA_EDITADO: (model, fem = false) =>
    `${model || ""} ${fem ? "editada" : "editado"} correactamente`,
  DATA_NO_EXIST: (model) =>
    `${model || "data"} no registrado o no existe en nuestra base de datos`,
  CREATE_ERROR: (model) => `Error en creación ${model || ""}`,
  CREATE_SUCCESS: (model) => `${model || ""} creado correctamente`,
  NOT_SEND_VALUE: (value) => `Se debe proveer ${value}`,
  MAX_LENGTH: (value, max = undefined) =>
    `${value} excede la cantidad de caracteres permitidos ${max || ""}`,
  MIN_LENGTH: (value, min) =>
    `${value} debe tener un minimo de ${min || ""} caracteres`,
  VALUE_INVALID: (value) => `${value || ""} invalido`,
  NO_EXIST: (value) => `No existe ${value}`,
};

exports.expressions = {
  FECHA:
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(Z|([+-]([01]\d|2[0-3]):[0-5]\d))?)?$/,
  NO_STRINGSPACES: /^\S+$/,
  PASSWORDS:
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/,
};

exports.MB_FACTOR = 1024 * 1024;

exports.strCodesEstados = {
  ACTIVA: "ACTIVA",
  INACTIVA: "INACTIVA",
  REVERSADA: "REVERSADA",
  ESPERA_AVAL: "ESPERA_AVAL",
  ASIST_Y_REP_DIA: "ASIST_Y_REP_DIA",
  ASIST_Y_REP_OTRO_DIA: "ASIST_Y_REP_OTRO_DIA",
  NO_ASIST_Y_REP_OTRO__DIA: "NO_ASIST_Y_REP_OTRO__DIA",
  NO_ASIST_Y_REP_DIA: "NO_ASIST_Y_REP_DIA",
  REINTEGRADO: "REINTEGRADO",
};

exports.strCodesTiposNovedades = {
  DOMIN_O_FESTIV_LABORA: "DOMIN_O_FESTIV_LABORA",
  DIA_LABORADO: "DIA_LABORADO",
  DIA_DESCANSO: "DIA_DESCANSO",
  INCAPACIDAD: "INCAPACIDAD",
  AUSENCIA_NO_JUSTIF: "AUSENCIA_NO_JUSTIF",
  LIC_NO_REMUN: "LIC_NO_REMUN",
  LIC_REMUN: "LIC_REMUN",
  LIC_MATERN: "LIC_MATERN",
  LIC_LUTO: "LIC_LUTO",
  PERMI_NO_REMUN: "PERMI_NO_REMUN",
  PERMI_REMUN: "PERMI_REMUN",
  DIAS_DE_VACA: "DIAS_DE_VACA",
  SUSPENSION: "SUSPENSION",
  CAPACi_SIN_CONTR: "CAPACi_SIN_CONTR",
  DIAS_SIN_SERVI: "DIAS_SIN_SERVI",
  TERM_CONTR: "TERM_CONTR",
};

exports.MB_FACTOR = 1024 * 1024;

exports.quitarTildes = (str) =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

exports.convertirFechaAHoraColombiana = (
  fechaInput,
  formato = "yyyy-MM-dd HH:mm:ss"
) => {
  if (typeof fechaInput === "string") {
    if (!fechaInput.includes("T")) fechaInput += "T00:00:00-05:00";
  } else if (fechaInput instanceof Date)
    fechaInput = fechaInput.toISOString().replace("Z", "-05:00");
  else
    throw new Error(
      "La entrada debe ser una cadena ISO o una instancia de Date."
    );
  const fecha = new Date(fechaInput);
  return format(fecha, formato, { locale: es });
};

exports.getFechaColombia = () => {
  const fecha = new Date();
  return new Date(
    fecha.toLocaleString("en-US", { timeZone: "America/Bogota" })
  );
};

exports.getFechaDiasAntes = (fechaBase, diasAntes) => {
  const fechas = [];
  const fecha = new Date(fechaBase + "T00:00:00Z");
  fechas.push(fecha.toISOString().split("T")[0]);

  for (let i = 0; i < diasAntes; i++) {
    fecha.setUTCDate(fecha.getUTCDate() - 1);
    fechas.push(fecha.toISOString().split("T")[0]);
  }
  return fechas;
};

exports.getNumDaysFechasArr = (fechas) => {
  if (fechas.length === 0) return [];

  const startDate = fechas[0];
  const endDate = fechas[fechas.length - 1];

  const allDatesInMonth = eachDayOfInterval({
    start: addDays(startDate, 1),
    end: addDays(endDate, 1),
  });

  const fechasRestantes = allDatesInMonth.map((date) => ({
    [`_d${getDate(date)}`]: {
      fecha: format(date, "yyyy-MM-dd"),
      // exist: fechas.some((f) => isEqual(parseISO(f), date)),
      numDay: getDate(date),
    },
  }));

  return fechasRestantes;
};

/**
 *
 * @param {[string]} fechas
 * @param {"ASC"|"DESC"} order
 * @returns
 */
exports.ordenarFechas = (fechas, order = "ASC") => {
  return fechas
    .map((fecha) => parseISO(fecha))
    .sort((a, b) => (order === "ASC" ? a - b : b - a))
    .map((fecha) => format(fecha, "yyyy-MM-dd"));
};

exports.transformDataDetallesAsist = (data) => {
  const result = {};

  Object.values(data).forEach((entry) => {
    const dayKey = Object.keys(entry).find((key) => key.startsWith("_d"));
    const dayData = entry[dayKey];
    result[dayKey] = { ...dayData };

    if (entry.tableValue !== null) {
      result[dayKey] = { ...result[dayKey], ...entry };
    }

    delete result[dayKey][dayKey];
  });

  return result;
};
exports.countTypoReporneNovedad = (novedades) => {
  const tiposReporte = [
    { 1: "1" },
    { 2: "2" },
    { 3: "3" },
    { I: "I" },
    { A: "A" },
    { L: "L" },
    { LR: "LR" },
    { LM: "LM" },
    { LT: "LT" },
    { P: "P" },
    { PR: "PR" },
    { V: "V" },
    { S: "S" },
    { CA: "C/A" },
    { NA: "N/A" },
    { T: "T" },
  ];
  const tiposCount = tiposReporte.map((reporte) => {
    const val = Object.values(reporte)[0];
    const key = Object.keys(reporte)[0];
    const novedads = novedades?.filter(
      (novedad) => novedad?.tipoNovedad?.reporte === val
    );
    return { [`${key}`]: novedads?.length || 0 };
  });
  return Object.assign({}, ...tiposCount);
};
