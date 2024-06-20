import { getUsuarios } from '@/core/services/administrador';
import useMainContext from '@/shared/Hooks/useMainContext';
import { ROUTE_IDS } from '@/utils/vars';
import EditIcon from '@mui/icons-material/Edit';
import { createUsuario, updateUsuario } from '@/core/services/administrador';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from 'react';
import {
  useLoaderData /*useRouteLoaderData*/,
  useRouteLoaderData,
} from 'react-router-dom';

const headerTable = [
  { key: 'idUsuario', name: 'ID' },
  { key: 'numDocumento', name: 'Cedula' },
  { key: 'activo', name: 'habilitado' },
  { key: 'nombre', name: 'Nombre Apellido' },
  { key: 'usuario', name: 'Usuario' },
];

const formatUsuariosData = (usuarios) => {
  return usuarios.map((user) => ({
    ...user,
    activo: user?.activo ? 'Habilitado' : 'Inhabilitado',
  }));
};

const useControlUsuarios = () => {
  // hooks
  const { tipoDocumentos } = useLoaderData();
  const { usuarios } = useRouteLoaderData(ROUTE_IDS.ADMIN_USUARIOS);
  const { handleNotification, colors } = useMainContext();
  // states
  const [modalShow, setModalShow] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [usuariosList, setUsuariosList] = useState(
    formatUsuariosData(usuarios)
  );

  const handleModal = (modalName) => {
    setModalShow(modalName);
  };
  const handleDataUsuario = (data = null) => {
    setUsuario(data);
    handleModal('usuario');
  };

  const handleListUsuarios = async () => {
    try {
      const { records } = await getUsuarios();
      setUsuariosList(formatUsuariosData(records || usuarios || []));
    } catch (error) {
      handleNotification(error?.message, 'error');
    }
  };

  const handleSubmitUsuarioEdit = async (values) => {
    try {
      //se crea un array para enviar solo los perfiles modificados.
      const perfilSend = [];
      ['perfRh', 'perfAdmin', 'perfResponsable'].map((e) => {
        if (values[e].edit) {
          perfilSend.push({
            id_usuario: values.idUsuario,
            id_perfil: values[e].idPerfil,
            activo: values[e].activo,
          });
        }
      });

      if (values.usuario != '') {
        const dataSend = {
          ...values,
          perfRh: undefined,
          perfAdmin: undefined,
          perfResponsable: undefined,
          confirmContrasenna: undefined,
          celular: String(values.celular),
        };
        if (perfilSend.length > 0) dataSend['arrayPerfil'] = perfilSend;
        if (values.contrasenna == '') delete dataSend.contrasenna;
        const { message } = await updateUsuario(values.idUsuario, dataSend);
        handleListUsuarios();
        handleModal(null);
        handleNotification(message);
      }
    } catch (error) {
      console.log('error:: ', error.message);
    }
  };

  const handleSubmitUsuarioCrear = async (values) => {
    try {
      const { message } = await createUsuario({
        ...values,
        celular: String(values.celular),
        activo: true,
      });
      handleListUsuarios();
      handleModal(null);
      handleNotification(message);
    } catch (error) {
      handleNotification(error?.message, 'error');
    }
  };
  const headerButtons = [
    {
      id: 1,
      name: 'Crear Usuario',
      handleClick: () => handleModal('usuario-crear'),
      color: 'primary',
      disabled: false,
    },
  ];
  const actionButtons = {
    title: 'Acciones',
    buttons: [
      {
        id: 1,
        name: 'Editar',
        handleClick: (index) => handleDataUsuario(usuariosList[index]),
        icon: EditIcon,
        color: 'primary',
      },
      // {
      //   id: 2,
      //   name: 'Eliminar',
      //   handleClick: () => showModalDeleteUser(),
      //   icon: DeleteForeverIcon,
      //   color: 'error',
      // },
    ],
  };
  return {
    usuario,
    modalShow,
    colors,
    tipoDocumentos,
    handleListUsuarios,
    handleModal,
    handleSubmitUsuarioCrear,
    handleSubmitUsuarioEdit,
    table: {
      headerButtons,
      headerTable,
      actionButtons,
      tableBodyData: usuariosList,
      pagination: true,
      inputFilter: true,
    },
  };
};

export default useControlUsuarios;
