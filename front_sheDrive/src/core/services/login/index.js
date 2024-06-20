import LOGIN_API from '@/core/api/login_api';
import { request } from '@/core/axios';

export const get_info_user_login = async (usuario) => {
  try {
    if (!usuario) return;
    const url = `${LOGIN_API.GET_USERINFO}?usuario=${usuario}`;
    const { data } = await request({ url });
    return data?.record || data?.records;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const login = async (dataSend) => {
  try {
    const { data } = await request(
      {
        url: LOGIN_API.POST_LOGIN,
        data: { ...dataSend },
      },
      'post'
    );
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const change_password = async (idUser, dataToSend) => {
  try {
    const { data } = await request(
      {
        url: LOGIN_API.POST_CHANGEPASSWORD + idUser,
        data: { ...dataToSend },
      },
      'put'
    );
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const logout = async (idUsuario) => {
  try {
    const { data } = await request({
      url: LOGIN_API.GET_LOGOUT(idUsuario),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
