
const authRouter = require("./auth.routes.js");


const tipoDocumentoRouter = require("./tipoDocumento.routes");
const usuarioRouter = require("./usuario.routes");
const perfilRouter = require("./perfil.routes");

exports.indexRoutes = {
  authRouter,
  tipoDocumentoRouter,
  usuarioRouter,
  perfilRouter,
};
