import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Stack, 
  Paper, 
  useTheme, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InsightsIcon from '@mui/icons-material/Insights';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LinkIcon from '@mui/icons-material/Link';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Assets
import Logo from '../../resources/logob.png'; 

const StatBox = ({ label, value, subtext }) => (
  <Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.12em' }}>
      {label}
    </Typography>
    <Typography variant="h4" color="white" fontWeight={700} sx={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {value}
    </Typography>
    {subtext && (
       <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
         {subtext}
       </Typography>
    )}
  </Box>
);

const FeatureBox = ({ icon, title, text }) => {
    const theme = useTheme();
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 4, 
                height: '100%', 
                border: '1px solid', 
                borderColor: 'rgba(255,255,255,0.1)',
                bgcolor: 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: 'rgba(210, 157, 92, 0.05)',
                    transform: 'translateY(-4px)'
                }
            }}
        >
            <Box sx={{ mb: 3, color: 'primary.main' }}>
                {icon}
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={700} color="white">
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {text}
            </Typography>
        </Paper>
    );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ pb: 10, bgcolor: '#05090f' }}>
      
      {/* --- HERO SECTION --- */}
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        pt: 20, 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#05090f', 
        backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(210, 157, 92, 0.1) 0%, transparent 60%), 
            radial-gradient(circle at 80% 80%, rgba(210, 157, 92, 0.05) 0%, transparent 50%)
        `,
      }}>
        
        <Box sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.3,
            zIndex: 0,
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip 
                label="INFRASTRUCTURE COMPLETE | PRODUCTION READY" 
                sx={{ 
                    mb: 4, 
                    fontWeight: 700, 
                    bgcolor: 'rgba(210, 157, 92, 0.1)', 
                    color: '#d29d5c', 
                    border: '1px solid rgba(210, 157, 92, 0.2)',
                    letterSpacing: '0.1em'
                }} 
              />
              <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '4rem' }, lineHeight: 1.1, fontWeight: 800, color: 'white' }}>
                Harnessing Volatility, <br />
                <span style={{ color: theme.palette.primary.main }}>With Systematic Execution</span>
              </Typography>
              <Typography variant="h4" sx={{ mb: 4, fontSize: { xs: '1.1rem', md: '1.6rem' }, color: 'text.secondary', fontWeight: 400, maxWidth: '90%' }}>
                Automated on-chain strategies built to harvest volatility across market conditions.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mb: 2, fontSize: '1.1rem', lineHeight: 1.8 }}>
              The updated system is built to operate based on market movement, not constant trading activity. Instead of relying on high volume, it is designed to respond to price changes as they happen, across both smaller and larger market moves.
              </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mb: 1, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Ready to deploy and scale.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/sales')}
                  sx={{ 
                      px: 5, py: 1.8, fontSize: '1rem', fontWeight: 700,
                      background: 'linear-gradient(45deg, #d29d5c 30%, #e3b578 90%)',
                      boxShadow: '0 4px 20px rgba(210, 157, 92, 0.4)'
                  }}
                >
                  SCALE ALLOCATION BUY EBONDS + BONUS
                </Button>
                {/* <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/sales')}
                  sx={{ px: 5, py: 1.8, fontSize: '1rem', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  Buy EBONDS
                </Button> */}
              </Stack>
              <Stack direction="row" spacing={{ xs: 4, md: 8 }} sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                 <StatBox label="Execution" value="Rules-Based" subtext="Systematic" />
                 <StatBox label="Efficiency" value="High" subtext="Capital Efficient" />
                 <StatBox label="bonus tiers" value="Up to 30%" subtext="Allocation" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
               <Box sx={{ position: 'relative', animation: 'float 6s ease-in-out infinite' }}>
                  <Box sx={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: '#d29d5c', filter: 'blur(120px)', opacity: 0.15, zIndex: 0 }} />
                  <img src={Logo} alt="Ebonds Interface" style={{ width: '100%', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
               </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- EVOLUTION SECTION: LEFT VS RIGHT --- */}
      <Box sx={{ py: 15, bgcolor: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: '0.15em', mb: 1, display: 'block' }}>
              MARKET INTELLIGENCE
          </Typography>
          <Typography variant="h2" sx={{ mb: 8, fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: 'white' }}>
            Why the Model <span style={{ color: '#d29d5c' }}>Evolved</span>
          </Typography>

          <Grid container spacing={6}>
            {/* LEFT: Structural Constraints */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 5, height: '100%', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <WarningAmberIcon color="warning" />
                  <Typography variant="h5" fontWeight={700} color="white">Structural Constraints</Typography>
                </Stack>
                <List spacing={3}>
                  {[
                    "Yield amplification via high ESIR APY increased inflation pressure.",
                    "Maintaining EBONDS premiums required disproportionate revenue allocation.",
                    "Buyback efficiency was tightly coupled to sustained volume expansion.",
                    "Low-volatility market regimes reduced scalability of fee-based strategies."
                  ].map((text, i) => (
                    <ListItem key={i} alignItems="flex-start" sx={{ px: 0, mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32, mt: 0.8 }}>
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 6, height: 6 }} />
                      </ListItemIcon>
                      <ListItemText primary={text} primaryTypographyProps={{ color: 'text.secondary', lineHeight: 1.6 }} />
                    </ListItem>
                  ))}
                </List>

                {/* Side-by-Side Comparison Box */}
                <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Volume-dependent yield</Typography>
                            <Typography variant="body2" color="primary.main" fontWeight={700}>Volatility-driven strategies</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">High APY, high inflation</Typography>
                            <Typography variant="body2" color="primary.main" fontWeight={700}>Sustainable APY, scalable design</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Revenue defending premiums</Typography>
                            <Typography variant="body2" color="primary.main" fontWeight={700}>Revenue building depth</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Market-cycle constrained</Typography>
                            <Typography variant="body2" color="primary.main" fontWeight={700}>Regime-agnostic execution</Typography>
                        </Box>
                    </Stack>
                </Box>
              </Paper>
            </Grid>

            {/* RIGHT: New System Design Goals */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ 
                p: 5, height: '100%', bgcolor: 'rgba(10, 16, 25, 0.5)', 
                border: '1px solid', borderColor: 'primary.main', borderRadius: 2,
                boxShadow: '0 0 30px rgba(210, 157, 92, 0.1)'
              }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h5" fontWeight={700} color="white">New System Design Goals</Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  We are transitioning to automated on-chain volatility harvesting systems, designed to capture both short- and wide-range price movements. Strategy performance is driven by volatility dynamics rather than sustained trading volume.
                </Typography>

                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                        <CurrencyBitcoinIcon sx={{ color: '#F7931A' }} />
                        <Typography variant="subtitle1" fontWeight={700} color="white">BTC Strategy (40%)</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">Target: 24% APY <br/> Digital Gold Volatility Harvesting.</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                        <LinkIcon sx={{ color: '#2A5ADA' }} />
                        <Typography variant="subtitle1" fontWeight={700} color="white">LINK Strategy (60%)</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">Target: 60% APY <br/> DeFi Core Asset Harvesting.</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <List spacing={2}>
                  {[
                    "Sustainable ESIR APY (4%–12%), prioritizing scalability and inflation control.",
                    "Revenue allocation focused on liquidity depth, with an EBONDS buyback reference target of $0.90.",
                    "Native USDC settlement to reduce operational overhead and execution friction.",
                    "Significantly expanded buyback capacity across both high- and low-volume market regimes.",
                    "Enhanced rewards and allocation bonuses for larger participants.",
                    "Maximum Exposure and active DCA Strategies with high allocation of USDC reserves."
                  ].map((text, i) => (
                    <ListItem key={i} alignItems="flex-start" sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: '#d29d5c' }} />
                      </ListItemIcon>
                      <ListItemText primary={text} primaryTypographyProps={{ color: 'white', lineHeight: 1.6 }} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Closure Statement */}
          <Box sx={{ mt: 10, textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h5" color="white" fontWeight={400} sx={{lineHeight: 1.6 }}>
          Maximum Exposure Strategy</Typography>
           <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 , fontSize: '1.2rem' }}>
               Limits exposure and rebalances selling surplus exposure when above target and realizing a profit, When below exposure, rebalances increasing back to target exposure, Each sell event generates a profit. Target Exposure changes dynamically, increasing on deeper corrections (fear) and lowering on new multiples (euphoria).       
                </Typography>
            <Typography variant="h5" color="white" fontWeight={400} sx={{lineHeight: 1.6 }}>
          Active DCA Strategies</Typography>
           <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
               Buying down at equidistant price levels and selling up to capitalize on the volatility, realizing a profit on each move upwards after a previous buy event.     
                </Typography>
           
          </Box>
        </Container>
      </Box>

      {/* --- FEATURE GRID --- */}
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
                <FeatureBox 
                    icon={<SmartToyIcon fontSize="large" />}
                    title="Automated Systems"
                    text="Our infrastructure uses hardcoded on-chain logic to harvest market volatility, removing the need for third-party volume dependency."
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <FeatureBox 
                    icon={<AllInclusiveIcon fontSize="large" />}
                    title="Systematic Flywheel"
                    text="Execution revenue is programmatically channeled into buybacks, ensuring value growth is driven by market capture, not sentiment."
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <FeatureBox 
                    icon={<InsightsIcon fontSize="large" />}
                    title="Alpha Access"
                    text="Allocation provides direct exposure to professional systematic strategies and market research insights reserved for the ecosystem."
                />
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;