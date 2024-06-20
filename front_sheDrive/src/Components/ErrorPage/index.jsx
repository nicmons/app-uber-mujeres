import { useEffect, useState } from 'react';
import { useRouteError } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import imageError from '../../assets/error_image.svg';

const ErrorPage = () => {
  const error = useRouteError();
  const [errorData, setErrorData] = useState({
    status: null,
    message: null,
  });

  useEffect(() => {
    setErrorData({ status: error.status, message: error.data });
  }, [error]);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h1" sx={{ fontWeight: 'Bold' }}>
              {errorData.status}
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: 5 }}>
              {errorData.message || 'ha ocurrido un error'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <img src={imageError} alt="" width={500} height={250} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ErrorPage;
