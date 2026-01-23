import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Chip
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const BuybackStats = () => {
  const buybackData = [
    { year: '2023', ebonds: '$23,300', esir: '$14,300', total: '$37,600' },
    { year: '2024', ebonds: '$51,800', esir: '$24,600', total: '$76,400' },
    { year: '2025', ebonds: '$69,100', esir: '$26,300', total: '$95,400' },
  ];

  const totals = { ebonds: '$144,200', esir: '$65,200', total: '$209,400' };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <Box sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2.5, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AttachMoneyIcon sx={{ fontSize: 32, color: 'white' }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="white">
              Total Buyback Statistics
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Historical performance across EBONDS & ESIR
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Compact Grid Display */}
        <Grid container spacing={2}>
          {buybackData.map((row) => (
            <Grid item xs={12} sm={4} key={row.year}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {row.year}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {row.total}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  EBONDS: {row.ebonds} | ESIR: {row.esir}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Total Summary */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="primary.dark" fontWeight={600} display="block">
            ALL TIME TOTAL
          </Typography>
          <Typography variant="h4" fontWeight={800} color="primary.dark">
            {totals.total}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Chip label={`EBONDS: ${totals.ebonds}`} size="small" color="primary" />
            <Chip label={`ESIR: ${totals.esir}`} size="small" color="secondary" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BuybackStats;