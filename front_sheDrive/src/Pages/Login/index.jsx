import { ErrorMessage, Form, Formik } from 'formik';
import InfoIcon from '@mui/icons-material/Info';
import {
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
  Grid,
  Link,
  Tooltip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import useControlPassword from './useControlPassword';
import ModalForgetPass from './modal/ModalForgetPass';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import { json, redirect, useNavigation } from 'react-router-dom';
import LoadingPage from '@/Components/LoadingPage';
import CustomRadio from '@/shared/Components/Inputs/CustomRadio/index.jsx';
import { getInfoTokenUserLogged } from '@/utils/functions';

const titleTootip =
  'Recuerde que para habilitar' +
  ' el cambio de contraseña esta' +
  ' será su numero de documento' +
  ' mas la primera letra de su' +
  ' nombre.';

export const loader = async () => {
  const tkn = await getInfoTokenUserLogged();
  if (tkn) {
    const { lay } = tkn;
    return redirect(`/${lay}/dashboard`);
  }
  return json({
    colors: {
      primary: 'success',
      HxPrimary: '#4caf50',
      secondary: 'secondary',
      HSecondary: '#ba68c8',
    },
  });
};
const LoginPage = () => {
  const navigation = useNavigation();
  const {
    initialValuesLoginForm,
    dataLogin,
    showPassword,
    showModalPass,
    PERFILCODES,
    setDataLogin,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleSubmit,
    handleGetUsuarioData,
    showModalPassword,
    closeModalPassword,
    validationSchemaLoginForm,
  } = useControlPassword();

  if (navigation.state === 'loading') return <LoadingPage />;
  return (
    <section>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
          paddingTop: '60px',
          backgroundColor: '#ffffff',
          paddingBottom: '60px',
          height: '100vh',
          padding: '20%',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography
              component="h1"
              variant="h5"
              style={{ color: '#242629', paddingBottom: '20px' }}
            >
              Inicio de Sesión
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Formik
              enableReinitialize={false}
              initialValues={initialValuesLoginForm}
              validationSchema={validationSchemaLoginForm}
              onSubmit={async (values) => await handleSubmit(values)}
            >
              {({
                values,
                isSubmitting,
                handleChange,
                setFieldValue,
                setValues,
              }) => {
                return (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <TextField
                          fullWidth
                          id="usuario"
                          label="Usuario"
                          name="usuario"
                          value={values.usuario}
                          onChange={(e) => {
                            if (dataLogin) {
                              setDataLogin({ empresas: null, perfiles: null });
                              setValues({
                                contrasenna: null,
                                perfil_code: null,
                                empresa_id: null,
                                perfil_id: null,
                              });
                            }
                            return handleChange(e);
                          }}
                          autoFocus
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon style={{ color: '#242629' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      {dataLogin?.perfiles && (
                        <Grid item xs={12} md={12}>
                          <TextField
                            select
                            fullWidth
                            label="Por favor, seleccione su perfil"
                            margin="normal"
                            name="perfil_id"
                            value={values.perfil_id}
                            onChange={(e) => {
                              setFieldValue('empresa_id', '');
                              return handleChange(e);
                            }}
                            style={{ color: '#242629' }}
                          >
                            {dataLogin?.perfiles?.map((option) => (
                              <MenuItem
                                key={option.idPerfil}
                                value={option.idPerfil}
                                onClick={() => {
                                  setFieldValue('perfil_code', option?.strCode);
                                }}
                              >
                                {option.nombre}
                              </MenuItem>
                            ))}
                          </TextField>
                          <div className="error1">
                            <ErrorMessage name="perfil_id" />
                          </div>
                        </Grid>
                      )}
                      {dataLogin?.empresas?.length > 0 &&
                        values.perfil_code === PERFILCODES.RESPONSABLE.str && (
                          <>
                            <Grid container spacing={2}>
                              <Grid
                                item
                                xs={12}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '10px',
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  style={{
                                    color: '#242629',
                                    paddingBottom: '10px',
                                  }}
                                >
                                  Seleccione Empresa:
                                </Typography>
                              </Grid>
                              {dataLogin?.empresas.map(
                                ({ idEmpresa, strCode }) => (
                                  <Grid
                                    key={idEmpresa}
                                    item
                                    xs={6}
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <CustomRadio
                                      idEmpresa={idEmpresa}
                                      strCode={strCode}
                                      selectedValue={values.empresa_id}
                                      onChange={(e) =>
                                        setFieldValue(
                                          'empresa_id',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Grid>
                                )
                              )}
                              <div className="error1" style={{ width: '100%' }}>
                                <ErrorMessage name="empresa_id" />
                              </div>
                            </Grid>
                          </>
                        )}
                      {values.perfil_id && (
                        <Grid item xs={12} md={12}>
                          <TextField
                            margin="normal"
                            fullWidth
                            name="contrasenna"
                            value={values.contrasenna}
                            onChange={handleChange}
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockOutlinedIcon
                                    style={{ color: '#242629' }}
                                  />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >
                                    {showPassword ? (
                                      <VisibilityOffOutlinedIcon
                                        style={{ color: '#242629' }}
                                      />
                                    ) : (
                                      <VisibilityOutlinedIcon
                                        style={{ color: '#242629' }}
                                      />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <div className="error1">
                            <ErrorMessage name="contrasenna" />
                          </div>
                        </Grid>
                      )}
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                      {dataLogin?.perfiles ? (
                        <Grid item xs={12} md={12}>
                          <CustomButton
                            type={'submit'}
                            disabled={isSubmitting}
                            submitting={isSubmitting}
                            color={'warning'}
                            fullWidth={true}
                            size="large"
                          >
                            Iniciar
                          </CustomButton>
                        </Grid>
                      ) : (
                        <Grid item xs={12} md={12}>
                          <CustomButton
                            disabled={!values.usuario || isSubmitting}
                            submitting={isSubmitting}
                            color={'warning'}
                            fullWidth={true}
                            type={'button'}
                            onClick={async () =>
                              await handleGetUsuarioData(values.usuario.trim())
                            }
                          >
                            Continuar
                          </CustomButton>
                        </Grid>
                      )}
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ marginBottom: '20px', marginTop: '10px' }}
        >
          <Grid item xs={12}>
            <Link
              variant="body2"
              sx={{
                cursor: 'pointer',
                color: '#ed6c02',
                textDecoration: 'none',
                fontSize: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => showModalPassword()}
            >
              ¿Olvido su contraseña?
            </Link>
            <Tooltip title={titleTootip} size="lg">
              <InfoIcon
                sx={{
                  cursor: 'pointer',
                  alignItems: 'center',
                  color: '#ed6c02',
                  marginLeft: '5px',
                  paddingTop: '2px',
                }}
              ></InfoIcon>
            </Tooltip>
          </Grid>
          <Grid item></Grid>
        </Grid>
      </Box>
      <ModalForgetPass open={showModalPass} onClose={closeModalPassword} />
    </section>
  );
};

export default LoginPage;
