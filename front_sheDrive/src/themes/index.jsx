import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme();

export const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#7145d6',
    },
  },
});
