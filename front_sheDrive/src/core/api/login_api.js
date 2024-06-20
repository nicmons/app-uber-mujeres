const LOGIN_API = {
  GET_USERINFO: 'usuario/info-login',
  GET_LOGOUT: (idUsuario = '') =>
    `auth/logout${idUsuario ? '/' + idUsuario : ''}`,
  POST_LOGIN: 'auth/login',
  POST_CHANGEPASSWORD: 'auth/password-update/',
};


export default LOGIN_API;
