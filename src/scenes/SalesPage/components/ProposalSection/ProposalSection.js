import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  Grid,
  Chip,
  Stack,
  Button,
  Collapse
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ProposalSection = () => {
  const [showDetails, setShowDetails] = useState(false);

  const keyMetrics = [
    { label: 'Base Price', value: '$0.865', color: 'primary' },
    { label: 'Buyback Target', value: '$0.90', color: 'success' },
    { label: 'BTC Bot', value: '40%', color: 'warning' },
    { label: 'LINK Bot', value: '60%', color: 'info' },
    { label: 'Expected Returns', value: '35-50%', color: 'success' },
    { label: 'Goal', value: '2x Buyback', color: 'error' }
  ];

  const keyPoints = [
    'Keep ESIR APY sustainable for flywheel growth',
    'Introduce automated Bitcoin & LINK bot trading',
    'Volatility harnessing covers bear markets',
    'BTC: 24% APY (backtested) | LINK: 60% APY (backtested)',
    'Bot revenue → EBONDS liquidity + buybacks',
    'Short & wide range bots for optimal profitability',
    'Goal: Double our buyback capacity'
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'success.main', p: 2.5, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <RocketLaunchIcon sx={{ fontSize: 32, color: 'white' }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="white">
              Strategic Proposal
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.95)' }}>
              Next-gen bot strategy to maximize holder rewards
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Key Metrics Compact Grid */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {keyMetrics.map((metric) => (
            <Grid item xs={6} sm={4} md={2} key={metric.label}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  bgcolor: `${metric.color}.light`, 
                  borderRadius: 2, 
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: `${metric.color}.main`
                }}
              >
                <Typography variant="caption" color={`${metric.color}.dark`} fontWeight={600} display="block" sx={{ fontSize: '0.7rem' }}>
                  {metric.label}
                </Typography>
                <Typography variant="h6" fontWeight={700} color={`${metric.color}.dark`} sx={{ fontSize: '1.1rem' }}>
                  {metric.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bot Strategy - Compact */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2, border: '1px solid', borderColor: 'warning.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CurrencyBitcoinIcon sx={{ fontSize: 24, color: 'warning.dark' }} />
                <Typography variant="subtitle2" fontWeight={700} color="warning.dark">
                  Bitcoin Bot (40%)
                </Typography>
              </Box>
              <Typography variant="caption" color="warning.dark">
                Conservative strategy • 24% APY backtested
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2, border: '1px solid', borderColor: 'info.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ShowChartIcon sx={{ fontSize: 24, color: 'info.dark' }} />
                <Typography variant="subtitle2" fontWeight={700} color="info.dark">
                  LINK Bot (60%)
                </Typography>
              </Box>
              <Typography variant="caption" color="info.dark">
                Higher volatility • 60% APY backtested
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Key Points Summary */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          {keyPoints.slice(0, 4).map((point, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                gap: 1.5, 
                p: 1.5, 
                bgcolor: 'background.default',
                borderRadius: 1.5,
                alignItems: 'center'
              }}
            >
              <Box sx={{ 
                minWidth: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'success.main', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                ✓
              </Box>
              <Typography variant="body2">
                {point}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Collapsible Details */}
        <Button
          fullWidth
          variant="text"
          onClick={() => setShowDetails(!showDetails)}
          endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mb: 2 }}
        >
          {showDetails ? 'Hide' : 'Show'} Full Strategy Details
        </Button>

        <Collapse in={showDetails}>
          <Stack spacing={1}>
            {keyPoints.slice(4).map((point, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  p: 1.5, 
                  bgcolor: 'background.default',
                  borderRadius: 1.5,
                  alignItems: 'center'
                }}
              >
                <Box sx={{ 
                  minWidth: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: 'success.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  ✓
                </Box>
                <Typography variant="body2">
                  {point}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Collapse>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2, border: '1px solid', borderColor: 'success.main' }}>
          <Typography variant="body2" fontWeight={700} color="success.dark" gutterBottom>
            🎯 Primary Goal: Double Our Buyback Capacity
          </Typography>
          <Typography variant="caption" color="success.dark">
            35-50% yearly returns to increase EBONDS liquidity & sustainable deflation
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProposalSection;