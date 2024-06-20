import SHARED_API from '../api';
import { request } from '../axios';

export const getUsuario = async (idUsuario) => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_USUARIO(idUsuario),
    });
    return data.records || data.record;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getDocumentList = async () => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_TIPOSDOCUMENTOS,
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
