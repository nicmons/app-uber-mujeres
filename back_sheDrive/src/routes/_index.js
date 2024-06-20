const express = require("express");
const { indexRoutes } = require("./_barrel");

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api/v1", router);

  //publicas
  router.use("/auth", indexRoutes.authRouter);

  //Privadas
  router.use("/tipoDocumento", indexRoutes.tipoDocumentoRouter);
  router.use("/usuario", indexRoutes.usuarioRouter);
  router.use("/perfil", indexRoutes.perfilRouter);
};
module.exports = routerApi;
