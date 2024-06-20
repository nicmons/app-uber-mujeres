import { Grid } from '@mui/material';
import { Form, Formik, ErrorMessage } from 'formik';
import CustomButton from '@/shared/Components/Inputs/CustomButton/index.jsx';
import CustomTextField from '@/shared/Components/Inputs/CustomTextfield/index.jsx';
import useFormUsuario from './useUsuarioForm';
import CustomCheckBox from '@/shared/Components/Inputs/CustomCheckbox';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect';

const UsuarioForm = ({ usuario, tiposDocumentos, onSubmit }) => {
  const { initialValuesusuario, validationSchema, checks, colors } =
    useFormUsuario({
      usuario,
    });
  return (
    <Formik
      validateOnChange
      validateOnBlur
      initialValues={initialValuesusuario}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
    >
      {({ handleChange, values, errors, setFieldValue }) => {
        return (
          <Form>
            <Grid
              container
              justifyContent="center"
              spacing={2}
              sx={{ marginTop: '10px' }}
            >
              {usuario && (
                <Grid item xs={12}>
                  <CustomSelect
                    labelId="Estado del usuario"
                    label="Estado del usuario"
                    id="activo"
                    name="activo"
                    value={values.activo}
                    onChange={handleChange}
                    options={[
                      {
                        value: true,
                        label: 'Habilitado',
                      },
                      {
                        value: false,
                        label: 'Deshabilitado',
                      },
                    ]}
                    error={errors.id_tipoDocumento}
                    // disabled={!!contacto || isSubmitting}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <CustomTextField
                  label="Nombre"
                  name="nombre"
                  type="text"
                  error={!!errors.nombre}
                  value={values.nombre}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="error1">
                  <ErrorMessage name="nombre" />
                </div>
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  label="Apellido"
                  name="apellido"
                  type="text"
                  error={!!errors.apellido}
                  value={values.apellido}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="error1">
                  <ErrorMessage name="apellido" />
                </div>
              </Grid>
              <Grid item xs={6}>
                <CustomSelect
                  labelId="Tipo de documento"
                  label="Tipo de documento"
                  id="tipoDocumento"
                  name="id_tipoDocumento"
                  value={values.id_tipoDocumento}
                  onChange={handleChange}
                  options={[
                    ...tiposDocumentos.map(({ idTipoDocumento, nombre }) => ({
                      value: idTipoDocumento,
                      label: nombre,
                    })),
                  ]}
                  error={errors.id_tipoDocumento}
                  // disabled={!!contacto || isSubmitting}
                />
                <div className="error1">
                  <ErrorMessage name="id_tipoDocumento" />
                </div>
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  disabled={true}
                  label="Numero documento"
                  name="numDocumento"
                  type="number"
                  error={!!errors.numDocumento}
                  value={values.numDocumento}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="error1">
                  <ErrorMessage name="numDocumento" />
                </div>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  label="Celular"
                  name="celular"
                  type="number"
                  error={!!errors.celular}
                  value={values.celular}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="error1">
                  <ErrorMessage name="numDocumento" />
                </div>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  label="Correo"
                  name="correo"
                  type="correo"
                  error={!!errors.correo}
                  value={values.correo}
                  onChange={handleChange}
                  fullWidth
                />
                <div className="error1">
                  <ErrorMessage name="correo" />
                </div>
              </Grid>
              {usuario && (
                <>
                  <Grid item xs={12}>
                    <h3 style={{ margin: '1px' }}>Perfiles</h3>
                    <Grid container spacing={2}>
                      {checks?.map(({ label, id, name }) => (
                        <Grid item sx={3} key={id}>
                          <CustomCheckBox
                            label={label}
                            checked={values[name].activo}
                            onChange={(e) => {
                              setFieldValue(`${name}.activo`, e.target.checked);
                              setFieldValue(`${name}.edit`, true);
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      label="Contraseña"
                      name="contrasenna"
                      type="password"
                      error={!!errors.contrasenna}
                      value={values.contrasenna}
                      onChange={handleChange}
                      fullWidth
                    />
                    <div className="error1">
                      <ErrorMessage name="contrasenna" />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      label="Confirmar Contraseña"
                      name="confirmContrasenna"
                      type="text"
                      error={errors.confirmContrasenna}
                      value={values.confirmContrasenna}
                      onChange={handleChange}
                      fullWidth
                    />
                    <div className="error1">
                      <ErrorMessage name="confirmContrasenna" />
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid
              container
              spacing={2}
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: 1,
              }}
            >
              <Grid item xs={6}>
                <CustomButton
                  fullWidth
                  variant="contained"
                  type="submit"
                  color={colors?.HxPrimary}
                >
                  {usuario ? 'Editar' : 'Crear'}
                </CustomButton>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UsuarioForm;
