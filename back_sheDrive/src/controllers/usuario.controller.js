const { httpError, httpSend } = require("#H/httpResponses");
const {
  hashValue,
  IsEqualValue,
  // getCurrentDate,
  compareHash,
  quitarEspaciosExtras,
} = require("#H/functions");
const { generarStringAleatorio, messages } = require("#H/utils");
const Usuario = require("#M/usuario.model");
const PerfilUsuario = require("#M/perfilUsuario.model");
const Perfil = require("#M/perfil.model");
// const Sesion = require("#M/sesion.model");
const sequelize = require("#DB/sequelize");
// const { cerrarSesion } = require("#H/customQueries");
const { strCodesPerfil } = require("#H/vars");

exports.list = async (req, res) => {
  try {
    const data = await Usuario.findAll({
      attributes: { exclude: ["contrasenna", "token"] },
      include: [
        {
          model: PerfilUsuario,
          attributes: ["idPerfilUsuario", "activo"],
          include: [{ model: Perfil }],
        },
      ],
      order: [["createdAt", "DESC"]],
      // raw: true,
    });

    httpSend(
      res,
      data.map((el) => el.toJSON()),
      "success"
    );
  } catch (error) {
    console.error(error);
    httpError(res, error.message, 500);
  }
};

exports.create_user = async (req, res) => {
  try {
    const {
      id_tipoDocumento,
      numDocumento,
      nombre,
      apellido,
      celular,
      correo,
      activo,
      idPersonal,
    } = req.body;

    const existUser = await Usuario.findOne({
      where: { id_personalBase: idPersonal },
      raw: true,
    });
    if (existUser)
      throw new Error(
        "Ya existe un usuario creado según este personal, si desea modificar la información dirijase al modulo para edición de usuarios"
      );

    // extraer el usuario desde el nombre, apellido y documento
    const usuario = `${quitarEspaciosExtras(nombre).split(" ")[0].toUpperCase()}.${numDocumento}`;
    // generar contraseña temporal
    const contrasenna = hashValue(generarStringAleatorio());
    // crear registro de usuario
    const createUser = await Usuario.create({
      usuario,
      numDocumento,
      contrasenna,
      nombre: quitarEspaciosExtras(nombre),
      apellido: quitarEspaciosExtras(apellido),
      celular,
      correo,
      activo,
      cambiarContrasenna: true,
      id_tipoDocumento,
      id_personalBase: idPersonal,
    });
    if (!createUser) throw new Error(messages.CREATE_ERROR("usuario"));

    httpSend(res, createUser, messages.USER_CREADO);
  } catch (error) {
    httpError(res, error?.message, 500);
  }
};
exports.show_user = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const user = await Usuario.findByPk(idUsuario, {
      raw: true,
      attributes: { exclude: ["contrasenna", "token", "intentosLogin"] },
    });
    httpSend(res, user, "success");
  } catch (error) {
    httpError(res, error.message, 500);
  }
};

exports.update_user = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { _usuario } = req;
    const {
      numDocumento,
      nombre,
      apellido,
      celular,
      correo,
      contrasenna,
      activo,
      id_tipoDocumento,
      arrayPerfil,
    } = req.body;
    //edit usuario
    if (!IsEqualValue(_usuario.nombre, nombre)) _usuario.nombre = nombre;
    if (!IsEqualValue(_usuario.apellido, apellido))
      _usuario.apellido = apellido;
    if (!IsEqualValue(_usuario.celular, celular)) _usuario.celular = celular;
    if (!IsEqualValue(_usuario.correo, correo)) _usuario.correo = correo;
    if (!IsEqualValue(_usuario.activo, activo)) _usuario.activo = activo;
    if (!IsEqualValue(_usuario.numDocumento, numDocumento))
      _usuario.numDocumento = numDocumento;
    if (!IsEqualValue(_usuario.id_tipoDocumento, id_tipoDocumento))
      _usuario.id_tipoDocumento = id_tipoDocumento;
    if (contrasenna != null) {
      const pass = await compareHash(contrasenna, _usuario.contrasenna);
      if (!pass) _usuario.contrasenna = hashValue(contrasenna);
    }
    await _usuario.save({ transaction: t });

    //create o edit perfiles
    if (arrayPerfil) {
      for (let index = 0; index < arrayPerfil.length; index++) {
        try {
          const elem = arrayPerfil[index];
          const [perfi, isNew] = await PerfilUsuario.findOrCreate({
            where: {
              id_perfil: elem.id_perfil,
              id_usuario: elem.id_usuario,
            },
            defaults: {
              activo: true,
            },
            transaction: t,
          });

          if (!isNew) {
            if (!IsEqualValue(perfi.activo, elem.activo)) {
              perfi.activo = elem.activo;
              await perfi.save({ transaction: t });
            }
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }

    await t.commit();
    httpSend(
      res,
      { ..._usuario?.dataValues, token: undefined, contrasenna: undefined },
      "Usuario actualizado correctamente"
    );
  } catch (error) {
    await t.rollback();
    httpError(res, error?.message, 500);
  }
};

exports.info_login = async (req, res) => {
  try {
    const { usuario } = req.query;
    const user = await Usuario.findOne({
      where: { usuario: usuario.trim(), activo: true },
      attributes: ["usuario"],
      include: [
        {
          required: false,
          model: PerfilUsuario,
          where: { activo: true },
          attributes: ["idPerfilUsuario"],
          include: [{ model: Perfil }],
        },
      ],
    });
    if (!user) return httpError(res, "No existe este usuario", 404);
    if (!user?.dataValues?.perfilUsuarios)
      return httpError(res, "Usuario no cuenta con un perfil asignado", 404);

    return httpSend(res, user.toJSON(), "success");
  } catch (error) {
    httpError(res, error?.message, 500);
  }
};

exports.resend_password = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    httpSend(res, idUsuario, "success");
  } catch (error) {
    httpError(res, `resend_password error ${error?.message}`, 500);
  }
};
