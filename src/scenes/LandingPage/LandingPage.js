import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Stack, 
  Card, 
  CardContent, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TokenIcon from '@mui/icons-material/Token';
import StorefrontIcon from '@mui/icons-material/Storefront'; // New icon for Presale

// Use your existing logo
import Logo from '../../resources/logob.png'; 

// NOTE: I commented out the background image to fix your "Module not found" error.
// You can uncomment it later if you verify the file exists at that path.
// import BgGradient from '../../resources/bg_gradient.svg'; 

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <Card sx={{ 
      height: '100%', 
      transition: 'transform 0.3s ease-in-out',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[4] }
    }}>
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={{ 
          display: 'inline-flex', 
          p: 2, 
          borderRadius: '50%', 
          bgcolor: 'primary.main', 
          color: 'white',
          mb: 2 
        }}>
          {icon}
        </Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      
      {/* --- HERO SECTION --- */}
      <Box sx={{ 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center',
        // Fallback background color if image is missing
        // background: `linear-gradient(135deg, #0a1019 0%, #1a202c 100%)`, 
        pt: { xs: 10, md: 0 }
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: 600 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main', 
                    letterSpacing: 1.5, 
                    textTransform: 'uppercase',
                    mb: 2,
                    display: 'block'
                  }}
                >
                  Welcome to Ebonds Finance
                </Typography>
                <Typography variant="h1" sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' }, 
                  fontWeight: 800, 
                  lineHeight: 1.1,
                  mb: 3,
                  background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, #ffffff)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent' 
                }}>
                  The Future of Decentralized Bonds
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  Maximize your yields on Arbitrum. Stake EBONDS to earn 20% guaranteed APY
                  and participate in our exclusive community rounds.
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/allocation-staking')}
                    sx={{ py: 1.5, px: 4, borderRadius: 50, fontSize: '1.1rem' }}
                  >
                    Start Staking
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/sales')}
                    sx={{ py: 1.5, px: 4, borderRadius: 50, fontSize: '1.1rem', borderWidth: 2 }}
                  >
                    Buy EBONDS
                  </Button>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
              <Box 
                component="img" 
                src={Logo} 
                alt="Ebonds Hero"
                sx={{ width: '60%', maxHeight: 600, filter: 'drop-shadow(0px 0px 40px rgba(210, 157, 92, 0.3))' }} 
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- STATS SECTION --- */}
      <Box sx={{ py: 8, bgcolor: 'secondary.main', color: 'white' }}>
        <Container>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h3" fontWeight={800} color="primary.main">20%</Typography>
              <Typography variant="h6">Guaranteed APY</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" fontWeight={800} color="primary.main">Community</Typography>
              <Typography variant="h6">Driven Ecosystem</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" fontWeight={800} color="primary.main">Arbitrum</Typography>
              <Typography variant="h6">Powered Network</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- FEATURES SECTION --- */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Ecosystem Features
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            A complete suite of DeFi tools designed to grow your portfolio securely.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={<MonetizationOnIcon fontSize="large" />}
              title="Allocation Staking"
              description="Stake your EBONDS tokens to earn high yield rewards (20% APY) and grow your ESIR holdings."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {/* UPDATED: Changed from Launchpad to Community Presale */}
            <FeatureCard 
              icon={<StorefrontIcon fontSize="large" />}
              title="Community Presale"
              description="Join our exclusive community rounds. Secure your allocation of EBONDS tokens with vesting benefits."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={<TokenIcon fontSize="large" />}
              title="Dual Token Economy"
              description="Benefit from our EBONDS and ESIR token model, designed to balance growth and rewards sustainability."
            />
          </Grid>
        </Grid>
      </Container>

      {/* --- CALL TO ACTION --- */}
      <Box sx={{ py: 12, bgcolor: '#f7f9fc', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Ready to start your journey?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Join thousands of users earning passive income on the Ebonds platform today.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/allocation-staking')}
            sx={{ py: 2, px: 6, borderRadius: 50, fontSize: '1.2rem' }}
          >
            Launch App
          </Button>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;