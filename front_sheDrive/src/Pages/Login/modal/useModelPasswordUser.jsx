import * as Yup from 'Yup';
const useModelPasswordUser = () => {
  const initialValuesRecuperarForm = {
    usuario: '',
    numeroDocumento: '',
  };

  const validationSchema = Yup.object().shape({
    usuario: Yup.string().required('El nombre del usuario es obligatorio'),
    numeroDocumento: Yup.string()
      .required('El numero de documento es obligatorio')
      .matches(/^[0-9]+$/, 'El numero de documento debe ser un número'),
  });

  return {
    initialValuesRecuperarForm,
    validationSchema,
  };
};

export default useModelPasswordUser;
