const { httpError, httpSend } = require("#H/httpResponses");
const Perfil = require("#M/perfil.model");

exports.list = async (req, res) => {
  try {
    const data = await Perfil.findAll({});
    httpSend(res, data);
  } catch (error) {
    httpError(
      res,
      `Error al traer la lista de perfiles ${error?.message}`,
      403
    );
  }
};
