import useMainContext from '@/shared/Hooks/useMainContext';
import { STR_CODE_PERFIL } from '@/utils/vars';
import * as Yup from 'Yup';

//"checks" se usa en el renderizado de los perfiles y la id es la id de la base de datos...
const checks = [
  { label: 'Administración', id: 3, name: 'perfAdmin' },
];

const checkPerfilActivo = (data, perfilCheck) => {
  if (!data) return false;
  if (data.length > 0) {
    const perfil = data.find((e) => e.perfil.strCode == perfilCheck);
    return perfil ? perfil.activo : false;
  } else {
    return false;
  }
};

const useFormUsuario = ({ usuario }) => {
  const { colors } = useMainContext();
  const initialValuesusuario = {
    id_tipoDocumento: usuario?.id_tipoDocumento || '-1',
    idUsuario: usuario?.idUsuario || '',
    usuario: usuario?.usuario || '',
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    correo: usuario?.correo || '',
    celular: usuario?.celular || '',
    numDocumento: usuario?.numDocumento || '',
    perfRh: {
      idPerfil: checks[0]['id'],
      activo: checkPerfilActivo(usuario?.perfilUsuarios, STR_CODE_PERFIL.RRHH),
      edit: false,
    },
    perfAdmin: {
      idPerfil: checks[1]['id'],
      activo: checkPerfilActivo(usuario?.perfilUsuarios, STR_CODE_PERFIL.ADMIN),
      edit: false,
    },
    perfResponsable: {
      idPerfil: checks[2]['id'],
      activo: checkPerfilActivo(
        usuario?.perfilUsuarios,
        STR_CODE_PERFIL.RESPONSABLE_PROCESO
      ),
      edit: false,
    },
    contrasenna: '',
    confirmContrasenna: '',
    activo: usuario?.activo == 'Habilitado' ? true : false,
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre del usuario es obligatorio'),
    apellido: Yup.string().required('El apellido del usuario es obligatorio'),
    numDocumento: Yup.string()
      .required('El numero de Documento es obligatorio')
      .matches(/^[0-9]*$/, 'Solo se permiten números'),
    celular: Yup.string()
      .required('El numero de Documento es obligatorio')
      .matches(/^[0-9]*$/, 'Solo se permiten números'),
    contrasenna: Yup.string()
      .nullable('La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmContrasenna: Yup.string().when('contrasenna', {
      is: (contrasenna) => contrasenna !== null && contrasenna !== undefined,
      then: () =>
        Yup.string()
          .required('La confirmación de la contraseña es requerida')
          .oneOf(
            [Yup.ref('contrasenna'), null],
            'Las contraseñas no coinciden'
          ),
      otherwise: () =>
        Yup.string()
          .nullable()
          .oneOf(
            [Yup.ref('contrasenna'), null],
            'Las contraseñas no coinciden'
          ),
    }),
    id_tipoDocumento: Yup.string()
      .notOneOf(['-1', ''], 'El tipo de documento es requerido')
      .required('Seleccione un tipo de documento para el usuario.'),
    correo: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Correo electrónico inválido'
      )
      .required('El correo es obligatorio'),
  });

  return {
    colors,
    checks,
    initialValuesusuario,
    validationSchema,
  };
};

export default useFormUsuario;
