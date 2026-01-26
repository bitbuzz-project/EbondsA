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
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InsightsIcon from '@mui/icons-material/Insights';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LinkIcon from '@mui/icons-material/Link';

// Assets
import Logo from '../../resources/logob.png'; 

// --- COMPONENTS ---

const StatBox = ({ label, value, subtext }) => (
  <Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
      {label}
    </Typography>
    <Typography variant="h4" color="white" fontWeight={700} sx={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {value}
    </Typography>
    {subtext && (
       <Typography variant="caption" color="primary.main" fontWeight={600}>
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

// --- MAIN PAGE ---

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
        
        {/* Decorative Grid Background */}
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
            
            {/* LEFT: TEXT CONTENT */}
            <Grid item xs={12} md={7}>
              
              <Chip 
                label="Systematic Architecture Live" 
                sx={{ 
                    mb: 4, 
                    fontWeight: 700, 
                    bgcolor: 'rgba(210, 157, 92, 0.1)', 
                    color: '#d29d5c', 
                    border: '1px solid rgba(210, 157, 92, 0.2)' 
                }} 
              />

              <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '4.5rem' }, lineHeight: 1.1, fontWeight: 800, color: 'white' }}>
                On-chain <br />
                <span style={{ color: theme.palette.primary.main }}>Systematic Bots</span>
              </Typography>
              
              <Typography variant="h4" sx={{ mb: 4, fontSize: { xs: '1.2rem', md: '2rem' }, color: 'text.secondary', fontWeight: 400 }}>
                Harvesting Volatility & Buybacks. <br/>
                <span style={{ color: 'white' }}>Accelerating Flywheel.</span>
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
                Earn ESIR rewards on staked EBONDS while automated buybacks drive value growth 
                and boost liquidity for both EBONDS and ESIR.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/allocation-staking')}
                  sx={{ 
                      px: 5, 
                      py: 1.8, 
                      fontSize: '1rem', 
                      background: 'linear-gradient(45deg, #d29d5c 30%, #e3b578 90%)',
                      boxShadow: '0 4px 20px rgba(210, 157, 92, 0.4)'
                  }}
                >
                  Start Staking
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/sales')}
                  sx={{ px: 5, py: 1.8, fontSize: '1rem', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  Buy EBONDS
                </Button>
              </Stack>

              {/* Data Strip */}
              <Stack direction="row" spacing={{ xs: 4, md: 8 }} sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                 <StatBox label="Conservative APY" value="4~12%" />
                 <StatBox label="Token Bonus" value="Up to 30%" />
                 <StatBox label="Delta Profit" value="Up to 35%" subtext="After Buyback Target" />
              </Stack>

            </Grid>
            
            {/* RIGHT: VISUAL / LOGO */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
               <Box 
                 sx={{ 
                   position: 'relative',
                   animation: 'float 6s ease-in-out infinite',
                   '@keyframes float': {
                       '0%': { transform: 'translateY(0px)' },
                       '50%': { transform: 'translateY(-20px)' },
                       '100%': { transform: 'translateY(0px)' }
                   }
                 }}
               >
                  <Box sx={{
                       position: 'absolute',
                       top: '20%', left: '20%',
                       width: '60%', height: '60%',
                       background: '#d29d5c',
                       filter: 'blur(120px)',
                       opacity: 0.15,
                       zIndex: 0
                   }} />
                  <img 
                    src={Logo} 
                    alt="Ebonds Interface" 
                    style={{ 
                        width: '100%', 
                        position: 'relative', 
                        zIndex: 1,
                        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
                    }} 
                  />
               </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* --- NEW SECTION: STRATEGIC ROADMAP --- */}
      <Box sx={{ py: 10, bgcolor: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="xl">
            <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: '0.15em', mb: 1, display: 'block' }}>
                MARKET INTELLIGENCE
            </Typography>
            <Typography variant="h2" sx={{ mb: 6, fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: 'white' }}>
                Strategic Pivot 2026: <span style={{ color: '#d29d5c' }}>The Real Yield Era</span>
            </Typography>

            <Grid container spacing={6}>
                
                {/* 1. BLIND SPOTS (Problem) */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 4, height: '100%', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <WarningAmberIcon color="warning" />
                            <Typography variant="h5" fontWeight={700} color="white">Identification of Blind Spots</Typography>
                        </Stack>
                        
                        <List dense>
                            {[
                                "High ESIR APY leads to excessive inflation, undermining flywheel growth and Dual Token Support.",
                                "A high premium on the EBONDS price also weakens the flywheel.",
                                "EBONDS outflows require the majority of revenue to support the premium.",
                                "The lack of a sustained altseason limits volume-based scalability.",
                                "Bear market periods with low volume make it difficult to sustain our Dual Token buyback targets.",
                                "A single ESIR buyback would have averaged 40% APY.",
                                "EBONDS buybacks have surpassed 68% of total buybacks."
                            ].map((text, i) => (
                                <ListItem key={i} alignItems="flex-start" sx={{ px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                        <Box sx={{ w: 6, h: 6, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 6, height: 6 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={text} primaryTypographyProps={{ color: 'text.secondary', lineHeight: 1.6 }} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* 2. THE PROPOSAL (Solution) */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ 
                        p: 4, 
                        height: '100%', 
                        bgcolor: 'rgba(10, 16, 25, 0.5)', 
                        border: '1px solid', 
                        borderColor: 'primary.main', 
                        borderRadius: 2,
                        boxShadow: '0 0 30px rgba(210, 157, 92, 0.1)'
                    }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <TrendingUpIcon color="primary" />
                            <Typography variant="h5" fontWeight={700} color="white">Proposal: Enhanced Flywheel</Typography>
                        </Stack>

                        <Typography variant="body1" color="text.secondary" paragraph>
                            We are shifting to Volatility Harvesting <strong>on-chain bots</strong>, capturing short- and wide-range movements with Strategies based on volatility rather than volume.
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <CurrencyBitcoinIcon sx={{ color: '#F7931A' }} />
                                        <Typography variant="subtitle1" fontWeight={700} color="white">Bitcoin Bot (40%)</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        Digital Gold. Conservative, predictable volatility.
                                        <br/><strong>Target: 24% APY</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <LinkIcon sx={{ color: '#2A5ADA' }} />
                                        <Typography variant="subtitle1" fontWeight={700} color="white">LINK Bot (60%)</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        DeFi Core. High beta, higher rewards.
                                        <br/><strong>Target: 60% APY</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <List dense>
                            {[
                                "Sustainable ESIR APY (4%–12%) focused on strategy scalability and lower inflation.",
                                "Revenue focused on Liquidity Depth and an EBONDS buyback target of $0.90.",
                                "Transition to native USDC, avoiding unnecessary bridging and swaps.",
                                "Significantly increased buyback capacity in all market conditions.",
                                "Higher rewards and bonuses for larger allocators."
                            ].map((text, i) => (
                                <ListItem key={i} alignItems="flex-start" sx={{ px: 0 }}>
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
        </Container>
      </Box>

      {/* --- FEATURE GRID (Original) --- */}
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
                <FeatureBox 
                    icon={<SmartToyIcon fontSize="large" />}
                    title="Systematic Bots"
                    text="Our onchain strategies automatically harvest volatility from the market, converting price action into sustainable revenue for buybacks."
                />
            </Grid>

            <Grid item xs={12} md={4}>
                <FeatureBox 
                    icon={<AllInclusiveIcon fontSize="large" />}
                    title="Flywheel Acceleration"
                    text="Bot revenue executes buybacks, driving value growth and permanently boosting liquidity depth for the entire ecosystem."
                />
            </Grid>

            <Grid item xs={12} md={4}>
                <FeatureBox 
                    icon={<InsightsIcon fontSize="large" />}
                    title="Exclusive Insights"
                    text="Gain access to institutional-grade market research, exclusive news, and alpha insights reserved for EBONDS holders."
                />
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;