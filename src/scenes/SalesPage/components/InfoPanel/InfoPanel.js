import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // Example icon
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';

const getIcon = (title) => {
  if (title.includes('Fair')) return <VerifiedUserIcon fontSize="large" color="primary" />;
  if (title.includes('Vesting')) return <TrendingUpIcon fontSize="large" color="secondary" />;
  return <StarsIcon fontSize="large" color="success" />;
};

const InfoPanel = ({ content }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: '0.3s',
        '&:hover': { translateY: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          {getIcon(content.title)}
        </Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content.text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;