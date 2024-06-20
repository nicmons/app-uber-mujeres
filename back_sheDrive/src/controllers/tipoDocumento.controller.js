const { httpError, httpSend } = require("#H/httpResponses");
const TipoDocumento = require("#M/tipoDocumento.model");

exports.list = async (req, res) => {
  try {
    const data = await TipoDocumento.findAll({});
    httpSend(res, data);
  } catch (error) {
    httpError(
      res,
      `Error al traer la lista de tipo documento ${error?.message}`,
      403
    );
  }
};
