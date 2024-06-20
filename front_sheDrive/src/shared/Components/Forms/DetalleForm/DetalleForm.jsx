import { ButtonGroup, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import CustomButton from '@/shared/Components/Inputs/CustomButton/index.jsx';
import useDetalleForm from './useDetalleForm.jsx';
import CustomModal from '../../Modal/CustomModal/index.jsx';
import ReversarForm from '../ReversarForm/ReversarForm.jsx';
import { TIPOS_GESTION_NOVEDAD } from '@/utils/vars/index.jsx';
import ButtonsFile from '../../Tabs/ButtonFile/index.jsx';

const DetalleForm = ({ data, modulo = 'historico' }) => {
  const {
    modalShow,
    dataModals,
    colors,
    listaMotivos,
    handleDetalle,
    handleGetAdjunto,
  } = useDetalleForm();
  return (
    <>
      <Formik validateOnBlur initialValues={{}}>
        {() => (
          <Form>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Nombre:
                  <Typography>
                    {' '}
                    {`${data['asistencium.personal.nombre'] || ''} ${data['asistencium.personal.apellido'] || ''}`}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Novedad:
                  <Typography>{`${data['idReporteNovedad']}`}</Typography>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Tipo de Novedad:
                  <Typography>{`${data['tipoNovedad.nombre']}`}</Typography>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Generada Por:
                  <Typography>{`${data['generado']}`}</Typography>
                </Typography>
              </Grid>
              {data['usuarioAprobo'] && (
                <Grid item xs={6}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Aprobado Por:
                    <Typography>{`${data['usuarioAprobo']}`}</Typography>
                  </Typography>
                </Grid>
              )}
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Inicio:
                  <Typography>{`${data['fechaInicioNovedad']}`}</Typography>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Fin:
                  <Typography>{`${data['fechaFinNovedad']}`}</Typography>
                </Typography>
              </Grid>
              {!!data?.archivos?.length && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Evidencias:
                  </Typography>
                  <ButtonGroup
                    orientation="vertical"
                    aria-label="Loading button group"
                    disableFocusRipple
                    disableRipple
                    fullWidth
                  >
                    {data.archivos.map((file, i) => (
                      <ButtonsFile
                        key={`file_${file.idAdjuntoNovedad}-${i}`}
                        file={file}
                        color={colors?.primary}
                        onClick={handleGetAdjunto}
                      />
                    ))}
                  </ButtonGroup>
                </Grid>
              )}
            </Grid>
            {modulo === 'historico' && (
              <Grid container spacing={1} sx={{ marginTop: 1 }}>
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
                    onClick={() =>
                      handleDetalle('reversar', data?.idReporteNovedad)
                    }
                    variant="contained"
                    sx={{
                      height: 50,
                      margin: '0 auto',
                      background: '#ed6c02',
                    }}
                  >
                    Reversar
                  </CustomButton>
                </Grid>
              </Grid>
            )}
          </Form>
        )}
      </Formik>
      <CustomModal
        titleColor={colors.HxPrimary}
        open={modalShow === 'reversar'}
        title={'Reversar Novedad'}
        onClose={() => handleDetalle('reversar', null)}
        minHeight="none"
        height="40vh"
        minWidth="none"
        width="50vw"
      >
        <ReversarForm
          idReporteNovedad={dataModals.reversar}
          tipo={
            modulo === 'historico'
              ? TIPOS_GESTION_NOVEDAD.REVERSAR
              : TIPOS_GESTION_NOVEDAD.CIERRE
          }
          motivosList={listaMotivos}
        />
      </CustomModal>
    </>
  );
};

export default DetalleForm;
