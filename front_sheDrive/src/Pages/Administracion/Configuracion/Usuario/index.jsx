import { Grid, Typography, Box } from '@mui/material';
import { json } from 'react-router-dom';

import useControlUsuarios from './useControlUsuarios';
import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import { throwErrorPage } from '@/utils/functions';
import CustomModal from '@/shared/Components/Modal/CustomModal';
import UsuarioForm from './Forms/Usuario/UsuarioForm';
import { getDocumentList } from '@/core/services';
import UsuarioCrear from './Forms/UsuarioByPersonalCrear';

export const loader = async () => {
  try {
    const [{ records: tipoDocumentos }] = await Promise.all([
      getDocumentList(),
    ]);
    return json({ tipoDocumentos });
  } catch (error) {
    throwErrorPage({
      status: 401,
      message: error,
    });
  }
};

const Usuario = () => {
  const {
    table,
    modalShow,
    usuario,
    colors,
    tipoDocumentos,
    handleModal,
    handleSubmitUsuarioCrear,
    handleSubmitUsuarioEdit,
  } = useControlUsuarios();
  return (
    <section>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Configuración de Usuarios</Typography>
          </Grid>
          <Grid item xs={12}>
            <TableActionComponent {...table} />
          </Grid>
        </Grid>
      </Box>
      <CustomModal
        open={modalShow === 'usuario-crear'}
        onClose={() => handleModal(null)}
        title={'Crear usuario'}
        titleColor={colors?.HxPrimary}
      >
        <UsuarioCrear
          onSubmit={handleSubmitUsuarioCrear}
          tipoDocumentos={tipoDocumentos}
        />
      </CustomModal>
      <CustomModal
        titleColor={colors?.HxPrimary}
        title={'Editar usuario'}
        open={modalShow === 'usuario'}
        onClose={() => handleModal(null)}
      >
        <UsuarioForm
          usuario={usuario}
          onSubmit={handleSubmitUsuarioEdit}
          tiposDocumentos={tipoDocumentos}
        />
      </CustomModal>
    </section>
  );
};

export default Usuario;
