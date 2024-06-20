import { useFormik } from 'formik';
import useCrearUsuario from './useUsuarioByPersonalCrear';
import { CircularProgress, Grid } from '@mui/material';
import CustomTextField from '@/shared/Components/Inputs/CustomTextfield';
import { useEffect } from 'react';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect';
import CustomButton from '@/shared/Components/Inputs/CustomButton';

const UsuarioCrear = ({ tipoDocumentos, onSubmit }) => {
  const {
    colors,
    initialValues,
    validationSchema,
    personalList,
    searchData,
    documentoFind,
    usuarioData,
    STATES_SEARCH,
    setDocumentoFind,
    setPersonalList,
    setSearchData,
    handleGetPersonals,
    handleSetUsuarioData,
    customSetDataUsuarioOnChange,
  } = useCrearUsuario();
  //   formik
  const { values, errors, handleChange, setValues, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (documentoFind) {
      setSearchData(STATES_SEARCH.GETPERSONAL);
      const handlerListar = setTimeout(() => {
        handleGetPersonals(documentoFind);
        setSearchData(null);
      }, 1500);
      return () => clearTimeout(handlerListar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentoFind]);

  useEffect(() => {
    if (usuarioData) setValues({ ...usuarioData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioData]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          justifyContent="center"
          spacing={2}
          sx={{ marginTop: '10px' }}
        >
          <Grid item xs={12}>
            <CustomTextField
              type="text"
              label="Ingrese un documento de personal valido"
              name="documentoFind"
              error={false}
              value={documentoFind}
              onChange={(e) => {
                setPersonalList([]);
                setDocumentoFind(e.target.value);
                handleSetUsuarioData({});
              }}
              fullWidth
            />
          </Grid>
          {searchData === STATES_SEARCH.GETPERSONAL && (
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <CircularProgress
                size={35}
                color={colors?.primary}
                sx={{ alignSelf: 'center' }}
              />
            </Grid>
          )}
          {personalList.length > 1 && (
            <Grid item xs={12}>
              <CustomSelect
                label={'Personal'}
                labelSelectDefault="Seleccionar personal"
                name="idPersonal"
                value={values.idPersonal}
                options={personalList.map((pers) => ({
                  label: `${pers.nombre || ''} ${pers.apellido || ''} (${pers?.area?.nombre} - ${pers?.empresa?.nombre})`,
                  value: pers.idPersonal,
                }))}
                onChange={(e) => {
                  customSetDataUsuarioOnChange(e);
                  return handleChange(e);
                }}
                error={false}
              />
            </Grid>
          )}
          {!['', '-1', undefined].includes(values.idPersonal) &&
            usuarioData && (
              <>
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
                      ...tipoDocumentos.map(({ idTipoDocumento, nombre }) => ({
                        value: idTipoDocumento,
                        label: nombre,
                      })),
                    ]}
                    error={!!errors.id_tipoDocumento}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomTextField
                    label="Numero documento"
                    name="numDocumento"
                    type="number"
                    error={!!errors.numDocumento}
                    value={values.numDocumento}
                    disabled={true}
                    fullWidth
                  />
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
                </Grid>

                <Grid item xs={12}>
                  <CustomButton
                    type={'submit'}
                    color={colors?.primary}
                    disabled={Object.keys(errors).length > 0}
                    fullWidth
                  >
                    Crear usuario
                  </CustomButton>
                </Grid>
              </>
            )}
        </Grid>
      </form>
    </>
  );
};

export default UsuarioCrear;
