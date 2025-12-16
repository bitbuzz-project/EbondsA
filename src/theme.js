import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // We can switch to 'dark' easily later
    primary: {
      main: '#d29d5c', // Your EBONDS Green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1a202c', // Dark Gunmetal for secondary actions
    },
    background: {
      default: '#F7F9FC', // Very light grey-blue, more "pro" than plain white
      paper: '#ffffff',
    },
    text: {
      primary: '#1A202C', // Sharp dark text (not pure black)
      secondary: '#718096', // Professional grey for subtitles
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Inter", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    button: { textTransform: 'none', fontWeight: 600 }, // No all-caps buttons (cleaner)
  },
  shape: {
    borderRadius: 12, // Modern, softer corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          padding: '10px 24px',
          fontSize: '1rem',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(1, 194, 117, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 20px rgba(0,0,0,0.04)', // Soft, expensive-looking shadow
          border: '1px solid rgba(0,0,0,0.03)',
        },
      },
    },
  },
});

export default theme;