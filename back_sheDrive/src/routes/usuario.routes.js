const { Router } = require("express");
const usuarioController = require("#C/usuario.controller");
const {
  validate_update_usuario,
  validate_enable_password,
} = require("#MW/usuario.middlewares");

const router = Router();

router.get("/list", usuarioController.list);
router.get("/info-login", usuarioController.info_login);
router.post("/create", usuarioController.create_user);
router.get("/show/:idUsuario", usuarioController.show_user);
router.put(
  "/update/:idUsuario",
  validate_update_usuario,
  usuarioController.update_user
);
router.patch(
  "/resend-password/:idUsuario",
  validate_enable_password,
  usuarioController.resend_password
);

module.exports = router;
