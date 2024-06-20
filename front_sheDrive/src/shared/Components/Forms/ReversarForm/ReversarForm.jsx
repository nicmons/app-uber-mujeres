import { Grid } from '@mui/material';
import { Form, Formik, ErrorMessage } from 'formik';
import CustomButton from '@/shared/Components/Inputs/CustomButton/index.jsx';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect/index.jsx';
import useReversarForm from './useReversarForm.jsx';
import CustomObservation from '../../Inputs/CustomObservation/index.jsx';
import { TIPOS_GESTION_NOVEDAD } from '@/utils/vars/index.jsx';

const ReversarForm = ({ idReporteNovedad, tipo, motivosList }) => {
  const { handleSubmit, initialValuesReversarForm, validationSchema } =
    useReversarForm({ idReporteNovedad, tipo });

  return (
    <Formik
      validateOnBlur
      initialValues={initialValuesReversarForm}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        await handleSubmit(values, resetForm);
      }}
    >
      {({ handleChange, values }) => (
        <Form>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            {(tipo === TIPOS_GESTION_NOVEDAD.REVERSAR ||
              tipo === TIPOS_GESTION_NOVEDAD.REINTEGRO) && (
              <Grid item xs={12}>
                <CustomSelect
                  labelId="Motivo de novedad"
                  label="Motivo de novedad"
                  id="id_motivo"
                  name="id_motivo"
                  onChange={handleChange}
                  options={motivosList}
                />
                <div className="error1">
                  <ErrorMessage name="id_motivo" />
                </div>
              </Grid>
            )}
            <Grid item xs={12}>
              <CustomObservation
                label="observación"
                name="observacion"
                type="text"
                value={values.observacion}
                onChange={handleChange}
              />
              <div className="error1">
                <ErrorMessage name="observacion" />
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <CustomButton
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  height: 50,
                  margin: '0 auto',
                  background: '#ed6c02',
                }}
              >
                Ok
              </CustomButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ReversarForm;
