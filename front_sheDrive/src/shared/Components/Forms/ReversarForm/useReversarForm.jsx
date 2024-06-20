import { putGestionNovedad } from '@/core/services/rrhh/index.js';
import { TIPOS_GESTION_NOVEDAD } from '@/utils/vars/index.jsx';
import * as Yup from 'Yup';

const useReversarForm = ({ tipo, idReporteNovedad }) => {
  const tipoCierre = tipo === TIPOS_GESTION_NOVEDAD.CIERRE;
  const initialValuesReversarForm = {
    id_motivo: tipoCierre ? undefined : '',
    idReporteNovedad: idReporteNovedad,
    observacion: '',
  };

  const validationSchema = Yup.object().shape({
    id_motivo: tipoCierre
      ? Yup.string().notRequired()
      : Yup.string().required('La novedad es requerida'),
    observacion: Yup.string().required('La observación es requerida'),
    idReporteNovedad: Yup.string().required('La novedad es requerida'),
  });

  const handleSubmit = async (values, resetForm) => {
    const dataSend = {
      id_motivo: values?.id_motivo,
      idReporteNovedad: values.idReporteNovedad,
      observacion: values.observacion,
    };

    console.log({ tipo, TIPOS_GESTION_NOVEDAD });

    try {
      const response = await putGestionNovedad(tipo, dataSend);
      console.log('Respuesta:', response);
      resetForm();
    } catch (error) {
      console.error('Error al enviar datos:', error.message);
    }
  };

  return {
    initialValuesReversarForm,
    validationSchema,
    handleSubmit,
  };
};

export default useReversarForm;
