const { Router } = require("express");
const tipoDocumentoController = require("#C/tipoDocumento.controller");

const router = Router();

router.get("/list", tipoDocumentoController.list);

module.exports = router;
