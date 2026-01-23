import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, TextField, InputAdornment, LinearProgress, Accordion, AccordionSummary, AccordionDetails, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

const TokenSalePage = () => {
  const [allocation, setAllocation] = useState('10000');
  
  // Sale Configuration
  const saleConfig = {
    basePrice: 0.865,
    buybackTarget: 0.90,
    hardCap: 1000000,
    raised: 345000,
    minAllocation: 2000,
  };

  // Exact bonus tiers from your data
  const bonusTiers = [
    { min: 2000, max: 4999, bonus: 3, roi: 7.1 },
    { min: 5000, max: 9999, bonus: 6, roi: 10.3 },
    { min: 10000, max: 19999, bonus: 8, roi: 12.4 },
    { min: 20000, max: 39999, bonus: 10, roi: 14.5 },
    { min: 40000, max: 79999, bonus: 12, roi: 16.5 },
    { min: 80000, max: 159999, bonus: 16, roi: 20.7 },
    { min: 160000, max: 279999, bonus: 20, roi: 24.9 },
    { min: 280000, max: 399999, bonus: 24, roi: 29.0 },
    { min: 400000, max: Infinity, bonus: 30, roi: 35.3 },
  ];

  const getTier = (amount) => {
    return bonusTiers.find(tier => amount >= tier.min && amount <= tier.max) || bonusTiers[0];
  };

  const allocAmount = parseFloat(allocation) || 0;
  const currentTier = getTier(allocAmount);
  const baseTokens = allocAmount / saleConfig.basePrice;
  const bonusTokens = baseTokens * (currentTier.bonus / 100);
  const totalTokens = baseTokens + bonusTokens;

  const handleParticipate = () => {
    if (allocAmount < saleConfig.minAllocation) {
      toast.error(`Minimum allocation is $${saleConfig.minAllocation.toLocaleString()}`);
      return;
    }
    toast.info("Connecting to smart contract...");
    // Add your smart contract integration here
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        
        {/* HEADER */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            EBONDS Token Sale
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bot-powered flywheel with automated Bitcoin & LINK trading
          </Typography>
        </Box>

        {/* 3 INFO CARDS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                bgcolor: '#4CAF50', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>🤖</Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Automated Trading Bots
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bitcoin & LINK volatility harnessing targeting 35-50% yearly returns
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                bgcolor: '#4CAF50', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>💰</Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Enhanced Buybacks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bot revenue → EBONDS liquidity & buybacks at $0.90 target
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%', border: '2px solid #F97316' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                bgcolor: '#F97316', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>🎁</Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Tiered Bonuses
              </Typography>
              <Typography variant="body2" sx={{ color: '#F97316', fontWeight: 700 }}>
                Up to 30% token bonus on larger investments.
                <br />
                Up to 35.3% ROI on $0.90 buyback target.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* SALE CARD */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #D97706 0%, #F97316 100%)',
          mb: 4,
          boxShadow: 3
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography sx={{ 
                    bgcolor: 'rgba(255,255,255,0.3)', 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: 1,
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    🔴 Live Now
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
                  Bot-Powered Sale Round
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)' }}>
                  Automated BTC & LINK trading with 35-50% expected returns
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Your Price
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>
                  $0.865
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {currentTier.bonus}% Bonus
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* PROGRESS */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" fontWeight={600}>Total Raised</Typography>
              <Typography variant="body2" fontWeight={700}>
                ${saleConfig.raised.toLocaleString()} / ${saleConfig.hardCap.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(saleConfig.raised / saleConfig.hardCap) * 100}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #F97316 0%, #D97706 100%)'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* ALLOCATION INPUT */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              40% BTC Bot (24% APY) + 60% LINK Bot (60% APY) = 35-50% Combined Returns
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Enter Allocation (USDC)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                  placeholder="10000"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">USDC</InputAdornment>,
                    sx: { fontSize: '1.5rem', fontWeight: 700 }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Min Allocation: $2000 • Tier bonuses up to 30%
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Your Bonus (0.0%)</Typography>
                      <Typography variant="h6" fontWeight={700}>{currentTier.bonus}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Tier Bonus (0.0%)</Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#F97316' }}>
                        +{bonusTokens.toFixed(0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">Total EBONDS</Typography>
                        <Typography variant="h5" fontWeight={800}>
                          {totalTokens.toFixed(0)} EBONDS
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleParticipate}
              disabled={allocAmount < saleConfig.minAllocation}
              sx={{
                mt: 3,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)'
                },
                '&:disabled': {
                  bgcolor: '#e0e0e0'
                }
              }}
            >
              Participate with {currentTier.bonus}% Bonus
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled
              sx={{
                mt: 2,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#9E9E9E',
                borderColor: '#E0E0E0'
              }}
            >
              Participate with 0.0% Bonus
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              ⓘ User Access requires capability through whitelisted address's timerising.
            </Typography>
          </CardContent>
        </Card>

        {/* TIER TABLE */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Tiered Bonus Structure
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Investment</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#F97316' }}>Token Bonus</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Profit at $0.90</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Bonus %</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { alloc: '$2000', bonus: '3%', profit: '$143', pct: '7.1%' },
                    { alloc: '$5000', bonus: '6%', profit: '$514', pct: '10.3%' },
                    { alloc: '$10000', bonus: '8%', profit: '$1,237', pct: '12.4%' },
                    { alloc: '$20000', bonus: '10%', profit: '$2,890', pct: '14.5%' },
                    { alloc: '$40000', bonus: '12%', profit: '$6,613', pct: '16.5%' },
                    { alloc: '$80000', bonus: '16%', profit: '$16,555', pct: '20.7%' },
                    { alloc: '$160000', bonus: '20%', profit: '$39,769', pct: '24.9%' },
                    { alloc: '$280000', bonus: '24%', profit: '$81,249', pct: '29.0%' },
                    { alloc: '$400000', bonus: '30%', profit: '$141,040', pct: '35.3%' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{row.alloc}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#F97316', fontWeight: 700 }}>
                        {row.bonus}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#4CAF50', fontWeight: 600 }}>
                        {row.profit}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{row.bonus}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}>
                        ↗ {row.pct}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>

        {/* INFO BOXES */}
        <Alert severity="info" sx={{ mb: 2 }}>
          Bot revenue will first build up EBONDS liquidity, then execute buybacks at the $0.90 target price.
        </Alert>
        
        <Alert severity="warning" sx={{ mb: 4 }}>
          Minimum investment is $2,000 USDC to qualify for tiered bonuses. The goal is to double our buyback capacity.
        </Alert>

        {/* FAQ */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 4, mb: 2 }}>
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>💡 How does the bot strategy work?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              We deploy automated trading bots on Bitcoin (40%) and LINK (60%) that use volatility harnessing strategies.
              These bots execute short and wide-range trades with backtested returns of 24% for BTC and 60% for LINK.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>💰 When will buybacks happen?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              Bot revenue will first build up EBONDS liquidity for the $0.865 base price, then execute buybacks at the $0.90 target price.
              This ensures price stability and provides profit margins for participants.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>🎯 What are the minimum requirements?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              Minimum investment is $2,000 USDC to qualify for tiered bonuses (3%). Investments scale up to 30% bonus for $400K+ contributions.
            </Typography>
          </AccordionDetails>
        </Accordion>

      </Container>
    </Box>
  );
};

export default TokenSalePage;