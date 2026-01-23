import { createTheme } from '@mui/material/styles';

// Brand Colors (Preserved)
const PRIMARY_GOLD = '#d29d5c';
const DARK_BG = '#0a1019'; // Deep luxury black/blue
const PAPER_BG = '#131a25'; // Slightly lighter for cards

const theme = createTheme({
  palette: {
    mode: 'dark', // Web3 apps usually default to dark mode for "pro" feel
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
      secondary: '#94a3b8', // Cool slate grey, better than standard grey
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
      letterSpacing: '-0.02em', // Tight spacing looks more premium
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
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
      textTransform: 'none', // NEVER use uppercase for buttons in modern UI
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    body1: {
      lineHeight: 1.7, // Increases readability
    },
  },
  shape: {
    borderRadius: 0, // Sharp corners = Trust/Finance. Round corners = Playful. Let's go semi-sharp.
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: DARK_BG,
          backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(210, 157, 92, 0.15), rgba(10, 16, 25, 0))', // Subtle gold glow at top
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Minimal radius
          padding: '12px 24px',
          boxShadow: 'none',
          border: '1px solid transparent',
          '&:hover': {
            boxShadow: 'none',
            borderColor: PRIMARY_GOLD,
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
          border: '1px solid rgba(255,255,255,0.05)', // High-end border look
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 16, 25, 0.7)', // Glassmorphism
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'none',
        },
      },
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