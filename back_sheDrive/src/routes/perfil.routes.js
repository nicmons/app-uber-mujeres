const { Router } = require("express");
const perfilController = require("#C/perfil.controller");

const router = Router();

router.get("/list", perfilController.list);

module.exports = router;
