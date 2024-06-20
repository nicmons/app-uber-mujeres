import { Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import CustomButton from '@/shared/Components/Inputs/CustomButton/index.jsx';
import useModelResponsableUser from './useModelResponsableUser';
import CustomModal from '@/shared/Components/Modal/CustomModal';

const ModalResponsableDeleteUSer = ({ open, onClose }) => {
  const { handleSubmit, initialValuesResponsableForm, validationSchema } =
    useModelResponsableUser({});

  return (
    <CustomModal open={open} onClose={onClose} title="">
      <Formik
        //  validateOnMount
        validateOnChange
        validateOnBlur
        initialValues={initialValuesResponsableForm}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values, resetForm);
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Grid
                container
                justifyContent="center"
                spacing={2}
                sx={{ marginTop: '10px' }}
              >
                <Grid item xs={12}>
                  <Typography variant="h5">
                    ¿Desea Eliminar el Usuario ?
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ marginTop: 1 }}>
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
                    type="button"
                    color="error"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </CustomButton>
                </Grid>
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
                    color="success"
                    // disabled={disabledSubmit}
                  >
                    Eliminar
                    {/* {contacto ? 'Guardar' : 'Crear'} */}
                  </CustomButton>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </CustomModal>
  );
};

export default ModalResponsableDeleteUSer;
