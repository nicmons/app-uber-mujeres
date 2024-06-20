
const Perfil = require("#M/perfil.model");
const PerfilUsuario = require("#M/perfilUsuario.model");
const Sesion = require("#M/sesion.model");
const Usuario = require("#M/usuario.model");
const TipoNovedad = require("#M/tipoNovedad.model"); 
const { Op, literal } = require("sequelize");
const {
  messages,
  strCodesEstados,
  strCodesTiposNovedades,
  getNumDaysFechasArr,
  ordenarFechas,
  transformDataDetallesAsist,
  countTypoReporneNovedad,
} = require("./utils");
const { lays } = require("./vars");
const {
  getDaysInMonth,
  isBefore: isBeforeDate,
  eachDayOfInterval,
  format,
  addDays,
} = require("date-fns");

const createDateRanges = (fechaInicio, fechaFin) =>
  eachDayOfInterval({
    start: fechaInicio,
    end: fechaFin,
  })?.map((fecha) => format(addDays(fecha, 1), "yyyy-MM-dd"));

/**
 * Esta es una función encuentra un usuario en una base de datos y devuelve su información incluyendo su rol y
 *excluyendo ciertos atributos si se especifican, si no lo encuentra devuelve null.
 * @param value - Este parámetro es un objeto que contiene las condiciones para buscar un usuario en la base de datos.
 * @param [exclude] - Un array opcional de cadenas que especifica qué
 * atributos del modelo Usuarios deben excluirse del resultado de la consulta. Si no se proporciona `exclude
 * o es una matriz vacía, se incluirán todos los atributos en el resultado.
 */
exports.findUser = async (value, exclude = ["contrasenna", "token"]) => {
  try {
    const user = await Usuario.findOne({
      where: value,
      include: [
        {
          model: PerfilUsuario,
          include: [{ model: Perfil }],
        },
      ],
      attributes: exclude && !!exclude?.length ? { exclude } : undefined,
    });
    return user;
  } catch (error) {
    throw new Error(`error fnd User ${error.message}`);
  }
};

/**
 * Este código exporta una función llamada getNovedadesCheckNomina que recupera una lista de novedades de la base de datos.
 * La función toma como entrada un objeto querys, el cual debe contener fechaInicioNovedad (fecha de inicio de las novedades) y fechaFinNovedad (fecha de finalización de las novedades).
 * La función primero verifica si las fechas ingresadas son válidas y arroja un error si no lo son. Luego consulta la base de datos para buscar las novedades que se encuentran dentro del rango de fechas especificado.
 * Las novedades se recuperan junto con sus registros asociados de Estado, TipoNovedad y Asistencia.
 * La función también recupera todos los registros de CheckNomina.
 * Finalmente filtra las novedades que tienen su correspondiente check en los registros de CheckNomina y devuelve las novedades restantes.
 * @param {*} querys
 * @returns
 */
exports.getNovedadesCheckNomina = async (querys) => {
  const { fechaInicioNovedad, fechaFinNovedad } = querys;
  if (fechaInicioNovedad === "undefined") {
    throw new Error("No se encuentran la fecha de inicio");
  } else if (fechaFinNovedad === "undefined") {
    throw new Error("No se encuentra la fecha fin de la novedad");
  } else if (!fechaInicioNovedad) {
    throw new Error("La fecha de inicio es inválida");
  } else if (!fechaFinNovedad) {
    throw new Error("La fecha fin de la novedad es inválida");
  }

  const rangosCheckNomina = createDateRanges(
    fechaInicioNovedad,
    fechaFinNovedad
  ).map((fecha) => ({
    [Op.startsWith]: fecha,
  }));

  try {
    const novedades = await ReporteNovedad.findAll({
      include: [
        {
          model: Estado,
        },
        {
          model: TipoNovedad,
        },
        {
          model: Asistencia,
          include: [
            {
              model: Personal,
              include: [{ model: Area }, { model: Empresa }, { model: Cargo }],
            },
          ],
        },
      ],
      where: {
        [Op.and]: [
          {
            fechaInicioNovedad: {
              [Op.or]: rangosCheckNomina,
            },
          },
        ],
      },
    });

    const checks = await CheckNomina.findAll({});

    // Filtrar novedades que no están en checkNomina
    const novedadesSinCheck = novedades.filter((novedad) => {
      return !checks.some(
        (check) => check.id_reporteNovedad === novedad.idReporteNovedad
      );
    });

    return novedadesSinCheck;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Este código exporta una función llamada getNovedadesAval que recupera una lista de objetos ReporteNovedad según los parámetros de consulta proporcionados.
 * La función comprueba si los parámetros fechaInicioNovedad y fechaFinNovedad son válidos y arroja un error si no lo son. Luego utiliza el método findAll para recuperar los objetos ReporteNovedad de la base de datos, incluidos sus objetos asociados Estado, TipoNovedad, Asistencia, Personal y Cargo.
 *  La función aplica un filtro para incluir solo objetos de ReporteNovedad que tengan un valor de aprobado no nulo y se encuentren dentro del rango de fechas especificado.
 * @param {*} querys
 * @returns
 */
exports.getNovedadesAval = async (querys) => {
  const { fechaInicio, fechaFin } = querys;
  if (fechaInicio === "undefined") {
    throw new Error("No se encuentran la fecha de inicio");
  } else if (fechaFin === "undefined") {
    throw new Error("No se encuentra la fecha fin de la novedad");
  } else if (!fechaInicio) {
    throw new Error("La fecha de inicio es inválida");
  } else if (!fechaFin) {
    throw new Error("La fecha fin de la novedad es inválida");
  }

  const rangosAval = createDateRanges(fechaFin, fechaInicio).map((fecha) => ({
    [Op.startsWith]: fecha,
  }));

  try {
    const data = await ReporteNovedad.findAll({
      include: [
        {
          model: Estado,
        },
        {
          model: TipoNovedad,
        },
        {
          model: Asistencia,
          include: [{ model: Personal, include: [{ model: Cargo }] }],
        },
      ],
      where: {
        fechaReporte: {
          [Op.or]: rangosAval,
        },
        aprobado: { [Op.not]: null },
      },
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * La función getHistoricoNovedad recupera novedades históricas en función de los parámetros de consulta proporcionados.
 * Incluye diversos modelos y asociaciones para recopilar información adicional relacionada con las novedades.
 * @param {*} querys
 * @returns
 */
exports.getHistoricoNovedad = async (querys) => {
  const { numDocumento } = querys;
  try {
    const includeClause = [
      {
        model: Asistencia,
        include: [{ model: Personal }],
      },
      {
        model: AdjuntoNovedad,
        attributes: [
          "fechaCargue",
          "idAdjuntoNovedad",
          "nombreFile",
          "nombreOriginal",
          "mimetype",
          "extension",
        ],
      },
      {
        model: Estado,
      },
      {
        model: TipoNovedad,
      },
      {
        model: Usuario,
        as: "usuarioReporto",
        attributes: ["nombre", "apellido"],
        required: false,
      },
      {
        model: Usuario,
        as: "usuarioAprobo",
        attributes: ["nombre", "apellido"],
        required: false,
      },
      { model: NovedadReversada },
    ];

    if (numDocumento) {
      includeClause[0].include[0].where = {
        numDocumento: numDocumento,
      };
    }

    const data = await ReporteNovedad.findAll({
      include: includeClause,
      limit: 100,
      order: [["fechaReporte", "DESC"]],
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Este código exporta una función llamada getNovedadesCrear que recupera una lista de datos de reporteNovedad según los parámetros de consulta proporcionados.
 * La función incluye varios modelos y asociaciones para recuperar datos relacionados.
 * Aplica filtros y ordena la consulta según los parámetros de entrada.
 * @param {*} querys
 * @returns
 */
exports.getNovedadesCrear = async (querys) => {
  try {
    const whereClause = {};
    const { numDocumento } = querys;

    // Si se proporciona un número de cédula, filtrar por ese número de documento
    if (numDocumento) {
      whereClause["$asistencium.personal.numDocumento$"] = numDocumento;
    }

    // Si no se proporciona un número de cédula, se devolverán las últimas 100 novedades
    const data = await ReporteNovedad.findAll({
      include: [
        {
          model: TipoNovedad,
        },
        {
          model: Estado,
        },
        {
          model: Usuario,
          as: "usuarioReporto",
          attributes: ["nombre", "apellido"],
          required: false,
        },
        {
          model: Usuario,
          as: "usuarioAprobo",
          attributes: ["nombre", "apellido"],
          required: false,
        },
        {
          model: Asistencia,
          include: [
            {
              model: Personal,
              include: [
                { model: Area, include: [{ model: CentroCosto }] },
                { model: Cargo },
              ],
            },
          ],
        },
        {
          model: AdjuntoNovedad,
        },
      ],
      limit: numDocumento ? null : 100, // Si se proporciona un número de cédula, no hay límite
      order: [["fechaReporte", "DESC"]],
      where: whereClause,
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

/**
 * Este código exporta una función llamada getNovedadesLista que recupera una lista de datos de reporteNovedad en función de los parámetros de consulta proporcionados.
 * La función aplica varios filtros a los datos en función de los valores de fechaReporte, idUsuario e idArea. También incluye modelos relacionados como Asistencia, TipoNovedad, Estado, Usuario y AdjuntoNovedad en la consulta.
 * Los datos resultantes se ordenan por el campo fechaReporte en orden descendente.
 * @param {*} querys
 * @returns
 */
exports.getNovedadesLista = async (querys) => {
  try {
    const whereClause = {};
    const { fechaReporte, idUsuario, idArea } = querys;

    if (fechaReporte) {
      // Obtener el primer día del mes y el último día del mes
      const [year, month] = fechaReporte.split("-");
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      endDate.setHours(23, 59, 59, 999);

      whereClause.fechaReporte = { [Op.between]: [startDate, endDate] };
    }
    if (idUsuario) {
      // Buscar todos las areas y empresas asociadas al usuario
      const lideresProceso = await LiderProceso.findAll({
        where: { id_usuario: idUsuario },
        raw: true,
      });

      if (lideresProceso.length > 0) {
        // Obtener un array de todos los IDs de área y empresa asociados al usuario responsable
        const idsAreas = lideresProceso.map((lider) => lider.id_area);
        const idsEmpresas = lideresProceso.map((lider) => lider.id_empresa);

        // Agregar una condición al whereClause para filtrar por áreas y empresas asociadas al usuario responsable
        whereClause["$asistencium.personal.id_area$"] = { [Op.in]: idsAreas };
        whereClause["$asistencium.personal.id_empresa$"] = {
          [Op.in]: idsEmpresas,
        };
      }
    }

    if (idArea) {
      whereClause["$asistencium.personal.id_area$"] = idArea;
    }

    const data = await ReporteNovedad.findAll({
      include: [
        {
          model: Asistencia,
          include: [
            {
              model: Personal,
              include: [{ model: Area }, { model: Empresa }, { model: Cargo }],
            },
          ],
        },
        {
          model: TipoNovedad,
        },
        {
          model: Estado,
        },
        {
          model: Usuario,
          as: "usuarioReporto",
          attributes: ["nombre", "apellido"],
          required: false,
        },
        {
          model: Usuario,
          as: "usuarioAprobo",
          attributes: ["nombre", "apellido"],
          required: false,
        },
        {
          model: AdjuntoNovedad,
        },
      ],
      order: [["fechaReporte", "DESC"]],
      where: whereClause,
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Este código exporta varias funciones que realizan diferentes consultas en la base de datos usando Sequelize.
 * La función getNovedadesReintegrar recupera una lista de registros reporteNovedad en función de ciertos criterios, incluidos numDocumento y strCodesTiposNovedades.TERM_CONTR.
 * @param {*} querys
 * @returns
 */
exports.getNovedadesReintegrar = async (querys) => {
  const whereClause = {};
  const { numDocumento } = querys;
  try {
    // Si se proporciona un número de cédula, filtrar por ese número de documento
    if (numDocumento) {
      whereClause["$asistencium.personal.numDocumento$"] = numDocumento;
    }
    whereClause["$tipoNovedad.strCode$"] = strCodesTiposNovedades.TERM_CONTR;
    const data = await ReporteNovedad.findAll({
      include: [
        {
          model: Estado,
        },
        {
          model: TipoNovedad,
        },
        {
          model: Asistencia,
          include: [
            {
              model: Personal,
              include: [{ model: Area }, { model: Empresa }, { model: Cargo }],
            },
          ],
        },
        {
          model: Usuario,
          as: "usuarioReporto",
          attributes: ["nombre", "apellido"],
          required: false,
        },
      ],
      where: whereClause,
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Este código exporta una función llamada getNovedadesPendientes que recupera informes de novedades pendientes.
 * Toma un objeto tokenDecodeduser como entrada, que contiene el token de usuario decodificado.
 * La función consulta la base de datos para encontrar los informes pendientes de novedades en función del ID de empresa del usuario.
 * Incluye modelos relacionados como Asistencia, Personal, Cargo y AdjuntoNovedad para recopilar información adicional.
 * Los resultados se ordenan por el campo fechaReporte en orden descendente y se devuelven como salida.
 * @param {*} tokenDecodeduser
 * @returns
 */
exports.getNovedadesPendientes = async (tokenDecodeduser) => {
  try {
    const whereClause = {};
    const id_empresa = tokenDecodeduser.eid;
    if (id_empresa) {
      whereClause["$asistencium.personal.id_empresa$"] = id_empresa;
      whereClause["adjuntoNovedad"] = false;
    }
    const data = await ReporteNovedad.findAll({
      include: [
        {
          model: Asistencia,
          include: [
            {
              model: Personal,
              include: [{ model: Cargo, attributes: ["nombre"] }],
            },
          ],
        },
        { model: AdjuntoNovedad },
      ],
      order: [["fechaReporte", "DESC"]],
      where: {
        idReporteNovedad: {
          [Op.notIn]: literal(
            '(SELECT "id_reporteNovedad" FROM "adjuntoNovedad")'
          ),
        },
        "$asistencium.personal.id_empresa$": id_empresa,
      },
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * La función getNovedadesAprobacion recupera una lista de registros de reporteNovedad que están esperando aprobación dentro de un rango de fechas específico.
 * @param {*} querys
 * @returns
 */
exports.getNovedadesAprobacion = async (querys) => {
  const { fechaInicio, fechaFin } = querys;
  if (fechaInicio === "undefined") {
    throw new Error("No se encuentran la fecha de inicio");
  } else if (fechaFin === "undefined") {
    throw new Error("No se encuentra la fecha fin de la novedad");
  } else if (!fechaInicio) {
    throw new Error("La fecha de inicio es inválida");
  } else if (!fechaFin) {
    throw new Error("La fecha fin de la novedad es inválida");
  }

  const rangosAprobacion = createDateRanges(fechaFin, fechaInicio).map(
    (fecha) => ({ [Op.startsWith]: fecha })
  );
  try {
    const data = await ReporteNovedad.findAll({
      include: [
        {
          model: Estado,
        },
        {
          model: TipoNovedad,
        },
        {
          model: Asistencia,
          include: [
            {
              model: Personal,
              include: [{ model: Area }, { model: Empresa }, { model: Cargo }],
            },
          ],
        },
        {
          model: Usuario,
          as: "usuarioReporto",
          attributes: ["nombre", "apellido"],
          required: false,
        },
      ],
      where: {
        fechaReporte: {
          [Op.or]: rangosAprobacion,
        },
        "$estado.strCode$": strCodesEstados.ESPERA_AVAL, //solo novedades a espera de aval
        aprobado: null,
      },
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getAllNovedades = async () => {
  try {
    const whereClause = {};
    const data = await ReporteNovedad.findAll({
      include: [
        {
          model: Estado,
        },
        {
          model: TipoNovedad,
        },
        {
          model: Asistencia,
          include: [{ model: Personal }],
        },
        {
          model: AdjuntoNovedad,
        },
      ],
      order: [["fechaReporte", "DESC"]],
      where: whereClause,
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.cerrarSesion = async (
  idUsuario,
  fechaLogOut,
  transaction = undefined
) => {
  try {
    const sesiones = await Sesion.findAll({
      where: { id_usuario: idUsuario, activo: true },
      transaction,
    });
    if (!sesiones?.length) throw new Error(`NSA ${messages.UNAUTHORIZED}`);
    for (let index = 0; index < sesiones.length; index++) {
      try {
        const sesion = sesiones[index];
        sesion.fechaLogOut = fechaLogOut;
        sesion.id_cliente = null;
        sesion.activo = false;
        transaction ? await sesion.save({ transaction }) : await sesion.save();
      } catch (error) {
        throw new Error(`Error close sessions: ${error.message}`);
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};

exports.getAsistenciasPersonal = async (
  tokenDecodeduser,
  numDocumento,
  fechas
) => {
  try {
    const fechaRangos = fechas?.map((date) => ({
      [Op.startsWith]: [date],
    }));

    const isResponsableUser =
      tokenDecodeduser?.lay === lays.RESPONSABLE_PROCESO;
    if (!isResponsableUser) throw new Error("no responsable user");

    const list = await Personal.findAll({
      where: {
        id_area: { [Op.in]: tokenDecodeduser?.aids },
        id_empresa: tokenDecodeduser?.eid,
        numDocumento: { [Op.not]: numDocumento },
        activo: true,
      },
      include: [
        {
          required: false,
          model: Asistencia,
          where: {
            fechaAsistencia: {
              [Op.or]: fechaRangos,
            },
            activo: true,
          },
        },
        { model: Cargo, attributes: ["nombre"] },
        { model: Area },
      ],
      order: [
        ["idPersonal", "DESC"],
        [Asistencia, "numDiaAsis", "ASC"],
      ],
    });
    return list.map((el) => el.toJSON());
  } catch (error) {
    throw new Error(error?.message);
  }
};

exports.getAsistenciasPersonalControl = async (querys, currentFecha) => {
  const { mesAnno, areasId } = querys;
  if (!mesAnno) throw new Error("seleccione una fecha");
  const diasMes = getDaysInMonth(mesAnno);
  try {
    const sendAreasId = areasId !== "undefined";
    const personals = await Personal.findAll({
      where: {
        activo: true,
        ...(sendAreasId && {
          id_area: { [Op.in]: areasId.split(",") },
        }),
      },
      include: [
        {
          required: false,
          model: Asistencia,
          where: {
            fechaAsistencia: {
              [Op.startsWith]: mesAnno,
            },
            activo: true,
          },
        },
        { model: Cargo, attributes: ["nombre"] },
        {
          model: Area,
          include: [{ model: CentroCosto }],
        },
      ],
      order: [
        ["idPersonal", "DESC"],
        // [Asistencia, "numDiaAsis", "ASC"],
      ],
    });

    const results = [];
    let id_area,
      id_empresa,
      supervisor = null;
    for (let i = 0; i < personals.length; i++) {
      const personal = personals[i];
      const asistencias = personal.asistencia || [];
      // inasistencias
      const intervalDates = Array.from({ length: diasMes }, (_, i) => ({
        numDay: i + 1,
        fecha: i + 1 <= 9 ? `${mesAnno}-0${i + 1}` : `${mesAnno}-${i + 1}`,
      }));
      // const dateInit = `${mesAnno}-01`;
      // const dateEnd = `${mesAnno}-${diasMes}`;
      const inasistencias = intervalDates.filter(
        (el) =>
          !asistencias.some((asi) => asi.numDiaAsis === el.numDay) &&
          isBeforeDate(el.fecha, currentFecha)
      );
      // novedades pendientes
      const asistenciaPromises = asistencias.map(async (asi) => {
        const reporte = await ReporteNovedad.findOne({
          where: {
            id_asistencia: asi?.idAsistencia,
            idReporteNovedad: {
              [Op.notIn]: literal(
                '(SELECT "id_reporteNovedad" FROM "adjuntoNovedad")'
              ),
            },
          },
          include: [
            { model: TipoNovedad, attributes: ["idTipoNovedad", "nombre"] },
          ],
        });
        return reporte.toJSON();
      });
      const resultAsistenciaPromises =
        await Promise.allSettled(asistenciaPromises);
      // novdades pendientes
      const _novedadesPendientes = resultAsistenciaPromises
        .map((e) => e.value)
        .filter((ele) => !!ele);

      // supervisor segun area y empresa del personal
      if (
        id_area !== personal?.id_area ||
        id_empresa !== personal?.id_empresa
      ) {
        const sups = await LiderProceso.findAll({
          where: {
            id_empresa: personal.id_empresa,
            id_area: personal?.id_area,
            activo: true,
          },
          attributes: ["idLiderProceso"],
          include: [
            {
              model: Usuario,
              attributes: [
                "idUsuario",
                "numDocumento",
                "nombre",
                "apellido",
                "id_personalBase",
              ],
            },
          ],
          limit: 1,
          order: [["createdAt", "DESC"]],
        });
        supervisor = sups[0]?.toJSON();
      }

      results.push({
        ...personal.toJSON(),
        supervisor,
        _inasistencias: { cant: inasistencias.length, data: inasistencias },
        _novedadesPendientes: {
          cant: _novedadesPendientes.length,
          data: _novedadesPendientes,
        },
      });
      id_area = personal?.id_area;
      id_empresa = personal?.id_empresa;
    }

    return await Promise.all(
      sendAreasId
        ? results.filter(
            ({ idPersonal, supervisor }) =>
              idPersonal !== supervisor?.usuario?.id_personalBase
          )
        : results
    );
  } catch (error) {
    throw new Error(error?.message);
  }
};

exports.getAsistenciasReporte = async (querys) => {
  try {
    const { areasId, fechaInicio, fechaFin } = querys;
    const rangosFechaReporte = createDateRanges(fechaInicio, fechaFin).map(
      (fecha) => ({
        [Op.startsWith]: fecha,
      })
    );
    const personals = await Personal.findAll({
      where: {
        activo: true,
        ...(areasId !== "undefined" && {
          id_area: { [Op.in]: areasId.split(",") },
        }),
      },
      include: [
        {
          model: Asistencia,
          attributes: {
            exclude: [
              "activo",
              "createdAt",
              "updatedAt",
              "id_usuarioReporto",
              "fechaReporte",
              "id_estadoAsistencia",
              "id_personal",
            ],
          },
          where: {
            [Op.and]: [
              {
                fechaAsistencia: {
                  [Op.or]: rangosFechaReporte,
                },
              },
            ],
            activo: true,
          },
          include: [
            {
              model: ReporteNovedad,
              attributes: ["observacionNovedad"],
              include: [
                { model: TipoNovedad, attributes: ["nombre", "reporte"] },
                {
                  model: AdjuntoNovedad,
                  attributes: ["id_reporteNovedad", "idAdjuntoNovedad"],
                },
              ],
            },
          ],
        },
        { model: Cargo, attributes: ["nombre"] },
        {
          model: Area,
          attributes: ["nombre"],
          include: [{ model: CentroCosto, attributes: ["nombre"] }],
        },
        {
          model: Empresa,
          attributes: ["nombre"],
          include: [
            {
              model: LiderProceso,
              where: { activo: true },
              attributes: ["idLiderProceso"],
              include: [{ model: Usuario, attributes: ["nombre", "apellido"] }],
            },
          ],
        },
      ],
      order: [["idPersonal", "DESC"]],
    });

    return personals.map((pers) => {
      const personal = pers.toJSON();

      const datesNumsDay = getNumDaysFechasArr(
        ordenarFechas([
          ...new Set(
            pers?.asistencia
              ?.map((asi) => asi?.fechaAsistencia)
              .concat(createDateRanges(fechaInicio, fechaFin))
          ),
        ])
      );
      const _info = datesNumsDay?.map((dataDates) => {
        const dataElemDate = Object.values(dataDates)[0];
        const dataAsistencia = personal.asistencia?.find(
          (asis) =>
            asis?.numDiaAsis === dataElemDate?.numDay &&
            asis.fechaAsistencia?.startsWith(dataElemDate.fecha)
        );
        let tableValue = !dataAsistencia
          ? { value: "N/R" }
          : {
              value:
                dataAsistencia?.reporteNovedads[0]?.tipoNovedad?.reporte ||
                "✔",
            };

        return Object.assign(dataDates, {
          ...dataAsistencia,
          ...tableValue,
        });
      });
      return {
        ...personal,
        detalles: {
          ...Object.assign(
            {},
            ...Object.entries(transformDataDetallesAsist(_info)).map((el) => {
              const asistenciaValues = el[1];
              const novedadesPersonal = personal?.asistencia
                ?.map((asis) => asis?.reporteNovedads)
                .flat();
              const typosCount = countTypoReporneNovedad(novedadesPersonal);
              return {
                [el[0]]: asistenciaValues?.value,
                novedades: personal?.asistencia
                  ?.map((asi) => asi.reporteNovedads?.length || 0)
                  .reduce((acc, cur) => acc + cur, 0),
                vac: typosCount["V"],
                inc: typosCount["I"],
                aus: typosCount["A"],
                susp: typosCount["S"],
                dom: typosCount["1"],
                licMat_Pat: typosCount["LM"],
                sin_contra: typosCount["CA"],
                uc_luto: typosCount["LT"],
                ucPer_Remunera: typosCount["PR"],
                retiro: typosCount["T"],
                soportePendiente: novedadesPersonal?.filter(
                  (nov) => nov?.adjuntoNovedads?.length === 0
                )?.length,
              };
            })
          ),
        },
      };
    });
  } catch (error) {
    throw new Error(error?.message);
  }
};

exports.inactivarPrevLideres = async (id_area, id_empresa, t) => {
  // inactivar lideres de proceso anteriores asignados al area y empresa
  await LiderProceso.update(
    { activo: false },
    {
      where: { activo: true, id_area, id_empresa },
      ...(t && { transaction: t }),
    }
  );
};
