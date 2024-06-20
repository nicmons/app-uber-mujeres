
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';

import imageLoading from '../../assets/loading.svg';


const LoadingPage = () => {

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h3" sx={{ fontWeight: 'Bold' }}>
              Cargado Información
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <img
              src={imageLoading}
              alt=""
              width={500} height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoadingPage;
