import { useMemo, useState } from 'react';
import useMainContext from '@/shared/Hooks/useMainContext';
import { getPersonalsByDocumento } from '@/core/services/administrador';
import * as Yup from 'Yup';

const STATES_SEARCH = {
  GETPERSONAL: 'personal',
};

const useCrearUsuario = () => {
  const { colors, handleNotification: notif } = useMainContext();
  // states
  const [personalList, setPersonalList] = useState([]);
  const [documentoFind, setDocumentoFind] = useState('');
  const [usuarioData, setUsuarioData] = useState(null);
  const [searchData, setSearchData] = useState(null);

  // const initialValues = (personalSelected) => ({
  //   nombre: personalSelected.nombre || '',
  //   apellido: personalSelected.apellido || '',
  //   numDocumento: personalSelected.numDocumento || '',
  //   celular: personalSelected.celular || '',
  // });
  const initialValues = useMemo(
    () => ({
      idPersonal: usuarioData?.idPersonal || '',
      nombre: usuarioData?.nombre || '',
      apellido: usuarioData?.apellido || '',
      numDocumento: usuarioData?.numDocumento || '',
      celular: usuarioData?.celular || '',
      correo: usuarioData?.correo || '',
      id_tipoDocumento: usuarioData?.id_tipoDocumento || '-1',
    }),
    [usuarioData]
  );
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre del usuario es requerido'),
    apellido: Yup.string().required('El apellido del usuario es requerido'),
    numDocumento: Yup.string().required(
      'El numero de documento del usuario es obligatorio'
    ),
    celular: Yup.string().required('El celular del usuario es requerido'),
    correo: Yup.string().required('El correo del usuario es requerido'),
    id_tipoDocumento: Yup.string()
      .required('El tipo de documento del usuario es requerido')
      .notOneOf(['-1', ''], 'El tipo de documento del usuario es requerido'),
  });

  const handleSetUsuarioData = (personal) =>
    setUsuarioData(() => {
      const { nombre, apellido, numDocumento, idPersonal } = personal;
      return {
        idPersonal: idPersonal ?? '',
        nombre,
        apellido,
        numDocumento,
        celular: '',
        correo: '',
        id_tipoDocumento: '-1',
      };
    });

  const customSetDataUsuarioOnChange = (e) => {
    const val = e.target.value;
    let personal = {};
    if (val !== '-1') {
      personal = personalList.find((pers) => pers.idPersonal === val);
    }
    handleSetUsuarioData({ ...personal, idPersonal: val });
  };

  const handleGetPersonals = async (documento) => {
    try {
      const { records } = await getPersonalsByDocumento(documento);

      if (records && records.length === 1) handleSetUsuarioData(records[0]);
      else setPersonalList(records);
    } catch (error) {
      notif(error.message, 'error');
    }
  };

  return {
    STATES_SEARCH,
    colors,
    personalList,
    validationSchema,
    searchData,
    usuarioData,
    documentoFind,
    initialValues,
    setUsuarioData,
    setPersonalList,
    setDocumentoFind,
    setSearchData,
    handleGetPersonals,
    handleSetUsuarioData,
    customSetDataUsuarioOnChange,
  };
};

export default useCrearUsuario;
