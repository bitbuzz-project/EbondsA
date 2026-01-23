import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const VisionPage = () => {
  const navigate = useNavigate();

  const blindSpots = [
    'High ESIR APY inflation undermines flywheel rewards',
    'EBONDS price support requires majority revenue',
    'Outflows limit flywheel scalability',
    'No sustained altseason to build up flywheel',
    'Bear markets make dual buyback unsustainable',
    'Without EBONDS buyback, ESIR APY would average 40%'
  ];

  const proposals = [
    'Keep ESIR APY at sustainable levels for flywheel growth',
    'Introduce automated Bitcoin & LINK bot trading',
    'BTC Bot (40%): Conservative strategy with 24% APY backtested',
    'LINK Bot (60%): Higher volatility with 60% APY backtested',
    'Volatility harnessing strategies cover bear markets',
    'Bot revenue directed to EBONDS liquidity and buybacks',
    'Buyback target set at $0.90 after liquidity buildup',
    'Goal: Double our buyback capacity through bot trading'
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        
        {/* HEADER */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Our Vision
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Addressing challenges and implementing strategic solutions for sustainable growth
          </Typography>
        </Box>

        {/* BLIND SPOTS vs PROPOSAL (Two Columns) */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          
          {/* LEFT: Blind Spots */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              boxShadow: 3,
              border: '2px solid #FFEBEE'
            }}>
              <Box sx={{ 
                bgcolor: '#F44336',
                p: 3
              }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                  ⚠️ Identified Blind Spots
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                  Critical issues requiring strategic pivot
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {blindSpots.map((issue, i) => (
                    <Box 
                      key={i}
                      sx={{ 
                        display: 'flex', 
                        gap: 2,
                        p: 2,
                        bgcolor: '#FFEBEE',
                        borderRadius: 2,
                        border: '1px solid #FFCDD2'
                      }}
                    >
                      <Box sx={{ 
                        minWidth: 32, 
                        height: 32, 
                        bgcolor: '#F44336', 
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem'
                      }}>
                        {i + 1}
                      </Box>
                      <Typography variant="body2" sx={{ pt: 0.5 }}>
                        {issue}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT: Strategic Proposal */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              boxShadow: 3,
              border: '2px solid #E8F5E9'
            }}>
              <Box sx={{ 
                bgcolor: '#4CAF50',
                p: 3
              }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                  ✅ Strategic Proposal
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                  Solutions to maximize holder rewards
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {proposals.map((point, i) => (
                    <Box 
                      key={i}
                      sx={{ 
                        display: 'flex', 
                        gap: 2,
                        p: 2,
                        bgcolor: '#E8F5E9',
                        borderRadius: 2,
                        border: '1px solid #C8E6C9'
                      }}
                    >
                      <Box sx={{ 
                        minWidth: 32, 
                        height: 32, 
                        bgcolor: '#4CAF50', 
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem'
                      }}>
                        ✓
                      </Box>
                      <Typography variant="body2" sx={{ pt: 0.5 }}>
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* KEY METRICS */}
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              Key Strategy Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#FFF3E0', borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#F97316' }}>40%</Typography>
                  <Typography variant="body2" color="text.secondary">BTC Bot Allocation</Typography>
                  <Typography variant="caption" color="text.secondary">24% APY Backtested</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#E3F2FD', borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#2196F3' }}>60%</Typography>
                  <Typography variant="body2" color="text.secondary">LINK Bot Allocation</Typography>
                  <Typography variant="caption" color="text.secondary">60% APY Backtested</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#E8F5E9', borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#4CAF50' }}>35-50%</Typography>
                  <Typography variant="body2" color="text.secondary">Expected Returns</Typography>
                  <Typography variant="caption" color="text.secondary">Combined Strategy</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#FCE4EC', borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#E91E63' }}>2x</Typography>
                  <Typography variant="body2" color="text.secondary">Buyback Goal</Typography>
                  <Typography variant="caption" color="text.secondary">Double Capacity</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* CALL TO ACTION */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
          boxShadow: 4
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 2 }}>
              Ready to Participate?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', mb: 3 }}>
              Join our token sale with tiered bonuses and be part of the next-generation DeFi strategy
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/sale')}
              sx={{
                bgcolor: 'white',
                color: '#EC4899',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: '#F5F5F5'
                }
              }}
            >
              GO TO TOKEN SALE
            </Button>
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
};

export default VisionPage;