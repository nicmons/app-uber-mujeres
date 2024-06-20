import { Grid, Typography } from '@mui/material';
import { Form, Formik, ErrorMessage } from 'formik';
import CustomButton from '@/shared/Components/Inputs/CustomButton/index.jsx';
import CustomCheckBox from '@/shared/Components/Inputs/CustomCheckbox/index.jsx';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect/index.jsx';
import CustomObservation from '@/shared/Components/Inputs/CustomObservation/index.jsx';
import CustomDate from '@/shared/Components/Inputs/CustomDate/index.jsx';
import useNovedadForm from './useNovedadForm.jsx';
import FileUpload from '../../Inputs/CustomFile/FileUpload.jsx';
import { sonObjetosIguales } from '@/utils/functions/index.js';

const NovedadForm = ({
  novedad,
  personal,
  afterSubmit,
  colors = {},
  onlyRead = false,
}) => {
  const {
    initialValuesNovedadForm,
    validationSchema,
    fechaToday,
    tipoNovedadesList,
    handleSubmitNovedadForm,
    handleGetMenorFechaFin,
  } = useNovedadForm({ novedad, personal });

  return (
    <>
      <Formik
        validateOnBlur
        initialValues={initialValuesNovedadForm}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (await handleSubmitNovedadForm(values)) {
            afterSubmit && (await afterSubmit(values));
          }
        }}
      >
        {({ handleChange, values, errors, setFieldValue }) => {
          return (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Typography variant="h6">Fecha: {fechaToday}</Typography>
                  <Typography variant="h6">
                    Nombre:
                    {`${personal?.nombre || ''} ${personal?.apellido || ''}`}
                  </Typography>
                </Grid>
              </Grid>
              <Form>
                <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                  <Grid item xs={12}>
                    <CustomSelect
                      disabled={onlyRead}
                      labelId="Tipo de Novedad"
                      label="Tipo de Novedad"
                      id="id_tipoNovedad"
                      name="id_tipoNovedad"
                      value={values.id_tipoNovedad}
                      onChange={handleChange}
                      options={tipoNovedadesList?.map(
                        ({ idTipoNovedad, nombre }) => ({
                          value: idTipoNovedad,
                          label: nombre,
                        })
                      )}
                      error={!!errors.id_tipoNovedad}
                    />
                    <div className="error1">
                      <ErrorMessage name="id_tipoNovedad" />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomObservation
                      disabled={onlyRead}
                      label="observación"
                      name="observacionNovedad"
                      type="text"
                      error={!!errors.observacionNovedad}
                      value={values.observacionNovedad}
                      onChange={handleChange}
                    />
                    <div className="error1">
                      <ErrorMessage name="observacionNovedad" />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomDate
                      disabled={onlyRead}
                      label="Fecha Inicio Novedad"
                      name="fechaInicioNovedad"
                      type="date"
                      error={!!errors.fechaInicioNovedad}
                      value={values.fechaInicioNovedad}
                      onChange={(e) => {
                        setFieldValue(
                          'fechaFinIsMenorToFechaInicio',
                          handleGetMenorFechaFin(
                            e.target.value,
                            values.fechaInicioNovedad
                          )
                        );
                        return handleChange(e);
                      }}
                      fullWidth
                    />
                    <div className="error1">
                      <ErrorMessage name="fechaInicioNovedad" />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomDate
                      disabled={onlyRead}
                      label="Fecha Fin Novedad"
                      name="fechaFinNovedad"
                      type="date"
                      error={!!errors.fechaFinNovedad}
                      value={values.fechaFinNovedad}
                      onChange={(e) => {
                        setFieldValue(
                          'fechaFinIsMenorToFechaInicio',
                          handleGetMenorFechaFin(
                            values.fechaInicioNovedad,
                            e.target.value
                          )
                        );
                        return handleChange(e);
                      }}
                      fullWidth
                    />
                    <div className="error1">
                      <ErrorMessage name="fechaFinNovedad" />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <div className="error1">
                      <ErrorMessage name="fechaFinIsMenorToFechaInicio" />
                    </div>
                  </Grid>

                  {!onlyRead && (
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
                      <Typography variant="h6" htmlFor="adjuntoNovedad">
                        ¿Adjuntar Evidencia?
                      </Typography>
                      <CustomCheckBox
                        checked={values.adjuntoNovedad}
                        onChange={(e) =>
                          setFieldValue('adjuntoNovedad', e.target.checked)
                        }
                      />
                    </Grid>
                  )}
                  {values.adjuntoNovedad && (
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
                      <FileUpload maxFiles={3} name={'adjuntos'} />
                      <div className="error1">
                        <ErrorMessage name="adjuntos" />
                      </div>
                    </Grid>
                  )}
                </Grid>
                {!onlyRead && (
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
                        sx={{ background: colors?.HxPrimary }}
                        disabled={sonObjetosIguales(
                          initialValuesNovedadForm,
                          values
                        )}
                      >
                        {novedad ? 'Guardar' : 'crear'}
                      </CustomButton>
                    </Grid>
                  </Grid>
                )}
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default NovedadForm;
