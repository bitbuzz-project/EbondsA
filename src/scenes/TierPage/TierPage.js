import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Chip, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const tiers = [
  { name: 'Seed', required: 1000, multiplier: '1x', color: '#718096', features: ['Basic Staking APY', 'Community Access'] },
  { name: 'Sapling', required: 10000, multiplier: '1.5x', color: '#01C275', features: ['Boosted APY (+5%)', 'Voting Rights', 'Presale Priority'] },
  { name: 'Tree', required: 50000, multiplier: '2x', color: '#2D3748', features: ['Max Staking APY', 'Exclusive Airdrops', 'Governance Council'] },
  { name: 'Oak', required: 100000, multiplier: '3x', color: '#000000', features: ['VIP Support', 'Private Deals', 'Zero Fees'] },
];

const TierPage = () => {
  return (
    <Box sx={{ pb: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Membership Tiers
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Hold and stake EBONDS to unlock exclusive benefits. Higher tiers grant larger allocation bonuses and voting power.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {tiers.map((tier) => (
            <Grid item xs={12} sm={6} md={3} key={tier.name}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4, 
                  position: 'relative', 
                  transition: '0.3s',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderColor: 'primary.main' }
                }}
              >
                <Box sx={{ bgcolor: tier.color, height: 8, width: '100%' }} />
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    {tier.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Required Stake
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                    {tier.required.toLocaleString()}+
                  </Typography>
                  <Chip label={`Multiplier: ${tier.multiplier}`} size="small" sx={{ mb: 3, fontWeight: 700 }} />

                  <Box sx={{ textAlign: 'left', mb: 3 }}>
                    {tier.features.map((feat) => (
                        <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600}>{feat}</Typography>
                        </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8, p: 6, bgcolor: 'background.paper', borderRadius: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Ready to level up?
            </Typography>
            <Button variant="contained" size="large" href="/allocation-staking" sx={{ borderRadius: 50, px: 4, py: 1.5, fontSize: '1.1rem' }}>
                Go to Staking
            </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TierPage;