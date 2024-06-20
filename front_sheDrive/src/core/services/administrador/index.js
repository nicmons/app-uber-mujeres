import ADMINISTRACION_API from '@/core/api/administrador_api';
import { request } from '@/core/axios';

export const getUsuarios = async () => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_USUARIOS_LIST,
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const updateUsuario = async (usuario, dataSend) => {
  try {
    const { data } = await request(
      {
        url: ADMINISTRACION_API.PUT_USUARIO_ADMINISTRACION(usuario),
        data: { ...dataSend },
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

export const createUsuario = async (dataSend) => {
  try {
    const { data } = await request(
      {
        url: ADMINISTRACION_API.POST_USUARIO_CREATE,
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

export const getAsignacionPersonalList = async () => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_ASIGNACION_RESP,
    });
    return data?.records || data?.record;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getPersonalDep = async (id_departamento) => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_ASIGNACION_RESP_ID(id_departamento),
    });
    return data?.records || data?.record;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const putNovedadAprovacion = async (idReporte, dataSend) => {
  try {
    const { data } = await request(
      {
        url: ADMINISTRACION_API.PUT_GESTIONAR_NOVEDAD_APROBACION(idReporte),
        data: { ...dataSend },
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

export const getDepartamentosList = async () => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_DESPARTAMENTOS_LIST,
    });
    return data?.records || data?.record;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
export const getListDepartamentosSupervisor = async (id_departamento) => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_LIST_DEPARTAMENTOS_SUPERVISOR(
        id_departamento
      ),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

/**
 *
 * @param {string|number} idPersonal
 * @param {{id_area: number|string ,id_empresa: number|string ,correo: string}} dataSend
 * @returns
 */
export const postAsignarResponable = async (idPersonal, dataSend) => {
  try {
    const { data } = await request(
      {
        url: ADMINISTRACION_API.POST_ASIGNAR_RESPONSABLE(idPersonal),
        data: dataSend,
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

export const postCheckNominaCreate = async (dataArray = []) => {
  try {
    const { data } = await request(
      {
        url: ADMINISTRACION_API.POST_CHECK_CREATE,
        data: {
          dataArray,
        },
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

export const patchEnableCambiarPassUser = async (idUsuario) => {
  try {
    const { data } = await request(
      {
        url: ADMINISTRACION_API.PATCH_CAMBIOCONTRASENNA_USER(idUsuario),
      },
      'patch'
    );
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getPersonalsByDocumento = async (documento) => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_PERSONAL_BY_DOCUMENTO(documento),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getPersonalReporteAsistencia = async (params) => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_PERSONALASISTENCIA_REPORTE(params),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
