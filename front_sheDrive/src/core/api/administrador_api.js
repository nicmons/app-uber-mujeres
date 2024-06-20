const ADMINISTRACION_API = {
  GET_USUARIOS_LIST: 'usuario/list',
  POST_USUARIO_CREATE: `usuario/create`,
  PUT_USUARIO_ADMINISTRACION: (idUsuario) => `usuario/update/${idUsuario}`,
  PATCH_CAMBIOCONTRASENNA_USER: (idUsuario) =>
    `usuario/resend-password/${idUsuario}`,
};

export default ADMINISTRACION_API;
