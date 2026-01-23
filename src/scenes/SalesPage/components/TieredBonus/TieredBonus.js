import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Slider,
  TextField,
  InputAdornment,
  Grid,
  Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';

const TieredBonus = () => {
  const [investment, setInvestment] = useState(10000);

  const tiers = [
    { amount: 2000, profit: 206, percentage: 10.3 },
    { amount: 5000, profit: 723, percentage: 14.5 },
    { amount: 10000, profit: 1861, percentage: 18.6 },
    { amount: 20000, profit: 4139, percentage: 20.7 },
    { amount: 40000, profit: 9942, percentage: 24.9 },
    { amount: 60000, profit: 16162, percentage: 26.9 },
    { amount: 100000, profit: 31098, percentage: 31.1 },
    { amount: 150000, profit: 52890, percentage: 35.3 },
    { amount: 200000, profit: 78844, percentage: 39.4 },
    { amount: 400000, profit: 182659, percentage: 45.7 }
  ];

  // Calculate profit for custom amount
  const calculateProfit = (amount) => {
    if (amount < 2000) return { profit: 0, percentage: 0 };
    
    // Find the two tiers to interpolate between
    let lowerTier = tiers[0];
    let upperTier = tiers[tiers.length - 1];
    
    for (let i = 0; i < tiers.length - 1; i++) {
      if (amount >= tiers[i].amount && amount <= tiers[i + 1].amount) {
        lowerTier = tiers[i];
        upperTier = tiers[i + 1];
        break;
      }
    }
    
    if (amount >= tiers[tiers.length - 1].amount) {
      return { 
        profit: (amount * tiers[tiers.length - 1].percentage / 100),
        percentage: tiers[tiers.length - 1].percentage 
      };
    }
    
    // Linear interpolation
    const ratio = (amount - lowerTier.amount) / (upperTier.amount - lowerTier.amount);
    const percentage = lowerTier.percentage + (upperTier.percentage - lowerTier.percentage) * ratio;
    const profit = amount * percentage / 100;
    
    return { profit, percentage };
  };

  const customCalc = calculateProfit(investment);

  return (
    <Card sx={{ borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CalculateIcon sx={{ fontSize: 40, color: 'white' }} />
          <Box>
            <Typography variant="h4" fontWeight={800} color="white">
              Tiered Bonus Structure
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)' }}>
              Profit at $0.90 buyback target - Higher investments unlock better bonuses
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 4 }}>
        {/* Interactive Calculator */}
        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Calculate Your Potential Profit
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Investment Amount"
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              <Slider
                value={investment}
                onChange={(e, val) => setInvestment(val)}
                min={2000}
                max={400000}
                step={1000}
                marks={[
                  { value: 2000, label: '$2K' },
                  { value: 100000, label: '$100K' },
                  { value: 400000, label: '$400K' }
                ]}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'success.light', borderRadius: 2, border: '2px solid', borderColor: 'success.main' }}>
                <Typography variant="caption" color="success.dark" fontWeight={600}>
                  YOUR ESTIMATED PROFIT
                </Typography>
                <Typography variant="h3" fontWeight={800} color="success.dark" gutterBottom>
                  ${customCalc.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Typography>
                <Chip 
                  label={`${customCalc.percentage.toFixed(1)}% Bonus`} 
                  color="success" 
                  size="small" 
                  sx={{ fontWeight: 700 }}
                />
                <Typography variant="caption" display="block" color="success.dark" sx={{ mt: 1 }}>
                  at $0.90 buyback target
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Tiered Table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell><Typography fontWeight={700}>Investment</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={700}>Profit at $0.90</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={700}>Bonus %</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={700}>ROI</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tiers.map((tier) => {
                const isSelected = investment >= tier.amount && 
                  (tiers.indexOf(tier) === tiers.length - 1 || investment < tiers[tiers.indexOf(tier) + 1].amount);
                
                return (
                  <TableRow 
                    key={tier.amount}
                    sx={{ 
                      bgcolor: isSelected ? 'action.selected' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: '0.2s'
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={isSelected ? 700 : 500}>
                        ${tier.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color="success.main">
                        ${tier.profit.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${tier.percentage}%`} 
                        size="small" 
                        color={isSelected ? 'primary' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        <TrendingUpIcon fontSize="small" color="success" />
                        <Typography fontWeight={600} color="success.dark">
                          {tier.percentage}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, p: 3, bgcolor: 'info.light', borderRadius: 2, border: '1px solid', borderColor: 'info.main' }}>
          <Typography variant="body2" color="info.dark" fontWeight={600} gutterBottom>
            💡 How Tiered Bonuses Work
          </Typography>
          <Typography variant="body2" color="info.dark">
            Larger investments unlock progressively higher bonus percentages. Your bonus tokens are calculated 
            at the base price of $0.865, and profit is realized when buybacks occur at the $0.90 target price. 
            This creates an immediate 4% price appreciation opportunity, plus your tiered bonus multiplier.
          </Typography>
        </Box>

        <Box sx={{ mt: 2, p: 3, bgcolor: 'warning.light', borderRadius: 2, border: '1px solid', borderColor: 'warning.main' }}>
          <Typography variant="body2" color="warning.dark" fontWeight={600}>
            ⚠️ Note: These calculations assume the buyback target of $0.90 is achieved. Actual profits may vary 
            based on market conditions and the timing of buyback execution. Bot revenue will be directed towards 
            building liquidity first, then executing buybacks.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TieredBonus;