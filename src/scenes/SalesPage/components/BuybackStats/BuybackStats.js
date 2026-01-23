import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  Divider,
  Stack
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const BuybackStats = () => {
  const buybackData = [
    { year: '2023', ebonds: '23,300', esir: '14,300', total: '37,600' },
    { year: '2024', ebonds: '51,800', esir: '24,600', total: '76,400' },
    { year: '2025', ebonds: '69,100', esir: '26,300', total: '95,400' },
  ];

  // Calculated from CSV
  const grandTotal = "$209,400";

  return (
    <Paper sx={{ 
        p: 0, 
        bgcolor: '#05090f', 
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 0, // Sharp corners
        overflow: 'hidden'
    }}>
      {/* HEADER: The Big Number */}
      <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <HistoryIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing="0.1em">
                CUMULATIVE BUYBACKS
            </Typography>
        </Stack>
        <Typography variant="h3" fontWeight={700} color="white" sx={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {grandTotal}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Total value returned to holders via automated protocol revenue.
        </Typography>
      </Box>

      {/* BODY: The Breakdown Grid */}
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
            {/* Table Header (Hidden on mobile, visible on desktop) */}
            <Grid item xs={12} sx={{ display: { xs: 'none', md: 'flex' }, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Grid container>
                    <Grid item xs={3}><Typography variant="caption" color="text.secondary">FISCAL YEAR</Typography></Grid>
                    <Grid item xs={3}><Typography variant="caption" color="text.secondary">EBONDS BURN</Typography></Grid>
                    <Grid item xs={3}><Typography variant="caption" color="text.secondary">ESIR BURN</Typography></Grid>
                    <Grid item xs={3} textAlign="right"><Typography variant="caption" color="text.secondary">TOTAL</Typography></Grid>
                </Grid>
            </Grid>

            {/* Rows */}
            {buybackData.map((row) => (
                <Grid item xs={12} key={row.year} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2 }}>
                    <Grid container alignItems="center">
                        <Grid item xs={12} md={3} sx={{ mb: { xs: 1, md: 0 } }}>
                            <Typography variant="body2" fontWeight={700} color="primary.main">{row.year}</Typography>
                        </Grid>
                        <Grid item xs={4} md={3}>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ display: { md: 'none' } }}>EBONDS</Typography>
                            <Typography variant="body2" fontFamily="monospace">${row.ebonds}</Typography>
                        </Grid>
                        <Grid item xs={4} md={3}>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ display: { md: 'none' } }}>ESIR</Typography>
                            <Typography variant="body2" fontFamily="monospace">${row.esir}</Typography>
                        </Grid>
                        <Grid item xs={4} md={3} textAlign={{ xs: 'left', md: 'right' }}>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ display: { md: 'none' } }}>TOTAL</Typography>
                            <Typography variant="body2" fontWeight={700} color="white" fontFamily="monospace">${row.total}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default BuybackStats;