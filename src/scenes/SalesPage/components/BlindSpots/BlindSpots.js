import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  Stack,
  Chip
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BlindSpots = () => {
  const blindSpots = [
    'High ESIR APY inflation undermines flywheel rewards',
    'EBONDS price support requires majority revenue',
    'Outflows limit flywheel scalability',
    'No sustained altseason to build up flywheel',
    'Bear markets make dual buyback unsustainable',
    'Without EBONDS buyback, ESIR APY would average 40%'
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <Box sx={{ bgcolor: 'warning.light', p: 2.5, borderBottom: '2px solid', borderColor: 'warning.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberIcon sx={{ fontSize: 32, color: 'warning.dark' }} />
          <Box>
            <Typography variant="h5" fontWeight={800} color="warning.dark">
              Identified Blind Spots
            </Typography>
            <Typography variant="caption" color="warning.dark">
              Critical issues requiring strategic pivot
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          {blindSpots.map((spot, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                gap: 1.5, 
                p: 1.5, 
                bgcolor: index % 2 === 0 ? 'background.default' : 'transparent',
                borderRadius: 2,
                alignItems: 'flex-start'
              }}
            >
              <Chip 
                label={index + 1} 
                size="small" 
                sx={{ 
                  minWidth: 28, 
                  height: 28, 
                  bgcolor: 'warning.main', 
                  color: 'white', 
                  fontWeight: 700 
                }} 
              />
              <Typography variant="body2" sx={{ flex: 1, pt: 0.5 }}>
                {spot}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="success" />
          <Typography variant="body2" color="success.dark" fontWeight={600}>
            Solution: Automated bot trading on BTC & LINK to double buyback capacity
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlindSpots;