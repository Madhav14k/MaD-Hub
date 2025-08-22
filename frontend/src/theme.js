import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A3C9E2', // Pastel blue
      contrastText: '#232946',
    },
    secondary: {
      main: '#F7B7A3', // Pastel coral
      contrastText: '#232946',
    },
    background: {
      default: '#FDF6F0', // Pastel cream
      paper: '#FFFFFF',
    },
    info: {
      main: '#B5EAD7', // Pastel mint
    },
    success: {
      main: '#C7E9B0', // Pastel green
    },
    error: {
      main: '#FFB5B5', // Pastel red
    },
    warning: {
      main: '#FFF6B7', // Pastel yellow
    },
    text: {
      primary: '#232946',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-2px' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px 0 rgba(90, 110, 130, 0.08)',
        },
      },
    },
  },
});

export default theme;
