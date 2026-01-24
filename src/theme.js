import { createTheme } from '@mui/material/styles';

// Brand Colors (Preserved)
const PRIMARY_GOLD = '#d29d5c';
const DARK_BG = '#0a1019'; 
const PAPER_BG = '#131a25'; 

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY_GOLD,
      contrastText: '#000000',
    },
    background: {
      default: DARK_BG,
      paper: PAPER_BG,
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94a3b8', 
    },
    action: {
      hover: 'rgba(210, 157, 92, 0.08)',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      // FIX: Responsive font size
      '@media (max-width:600px)': {
        fontSize: '2.5rem', 
      },
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      // FIX: Responsive font size
      '@media (max-width:600px)': {
        fontSize: '2rem', 
      },
    },
    h3: { fontFamily: '"Space Grotesk", sans-serif' },
    h4: { fontFamily: '"Space Grotesk", sans-serif' },
    h5: { fontFamily: '"Space Grotesk", sans-serif' },
    h6: { 
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Space Grotesk", sans-serif',
      textTransform: 'none', 
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    body1: {
      lineHeight: 1.7, 
    },
  },
  shape: {
    borderRadius: 4, // Slightly rounded for modern feel
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: DARK_BG,
          backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(210, 157, 92, 0.15), rgba(10, 16, 25, 0))',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Standardize button radius
          padding: '10px 20px',
          boxShadow: 'none',
          border: '1px solid transparent',
          transition: 'all 0.2s ease-in-out', // Smooth hover
          '&:hover': {
            boxShadow: '0 4px 12px rgba(210, 157, 92, 0.15)', // Glow effect
            borderColor: PRIMARY_GOLD,
            transform: 'translateY(-1px)', // Subtle lift
          },
        },
        contained: {
          color: '#000000',
          '&:hover': {
            backgroundColor: '#e3b578',
          },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.15)',
          color: '#FFFFFF',
          '&:hover': {
            borderColor: PRIMARY_GOLD,
            backgroundColor: 'rgba(210, 157, 92, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: PAPER_BG,
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 12, // Softer cards
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 16, 25, 0.8)', 
          backdropFilter: 'blur(20px)', // Stronger blur
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a1019', // Match app background
          borderLeft: '1px solid rgba(255,255,255,0.1)',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;