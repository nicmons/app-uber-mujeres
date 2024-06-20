const { Router } = require("express");
const authController = require("#C/auth.controller");

const {
  valid_user_passw_login,
  valid_logout,
  valid_update_pass,
} = require("#MW/auth/auth.middlewares");

const router = Router();

router.post("/login", valid_user_passw_login, authController.login);
router.get("/logout/:idUsuario?", valid_logout, authController.logout);
router.put(
  "/password-update/:idUsuario",
  valid_update_pass,
  authController.updatePassword
);

module.exports = router;
