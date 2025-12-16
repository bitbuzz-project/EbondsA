import React from 'react';
import { Box, Container, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { SwapWidget } from '@uniswap/widgets';
import '@uniswap/widgets/dist/fonts.css';

// 1. Define your Token List
const MY_TOKEN_LIST = [
  {
    "name": "EBONDS",
    "address": "0x53ee546eb38fb2c8b870f56deeaecf80367a4551",
    "symbol": "EBONDS",
    "decimals": 18,
    "chainId": 42161,
    "logoURI": "https://ebonds.finance/whitelogo.png"
  },
  {
    "name": "ESIR",
    "address": "0x8C75a1C86C21b74754FC8e3Bc4e7f79B4fCC5a28",
    "symbol": "ESIR",
    "decimals": 18,
    "chainId": 42161,
    "logoURI": "https://ebonds.finance/ESIR.png"
  },
  {
    "name": "Bridged USDC",
    "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    "symbol": "USDC.e",
    "decimals": 6,
    "chainId": 42161,
    "logoURI": "https://arbiscan.io/token/images/centre-usdc_28.png"
  },
];

// 2. Default Addresses
const NATIVE = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'; // USDC.e as input
const EBONDS_ADDRESS = '0x53ee546eb38fb2c8b870f56deeaecf80367a4551'; // EBONDS as output

const AboutPage = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // 3. Match Uniswap Theme to your App Theme
  const widgetTheme = {
    primary: '#1a202c',       // Text Color (Dark)
    secondary: '#718096',     // Subtext Color
    interactive: '#F7F9FC',   // Button Backgrounds
    container: '#ffffff',     // Card Background (Matches our wrapper now)
    module: '#F7F9FC',        // Input Fields
    accent: '#01C275',        // EBONDS Green (Action Buttons)
    outline: '#E2E8F0',       // Borders
    dialog: '#ffffff',        // Popups
    fontFamily: '"Space Grotesk", sans-serif',
    borderRadius: 0.8,        // Matches your rounded look
  };

  return (
    <Box sx={{ 
      py: 4, // Reduced padding top
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      flexDirection: 'column' 
    }}>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Header Text */}
        <Box sx={{ textAlign: 'center', mb: 3 }}> {/* Reduced margin-bottom from 6 to 3 */}
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Swap
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Trade EBONDS instantly with zero platform fees.
          </Typography>
        </Box>

        {/* Widget Container - Fixed Transparency */}
        <Paper 
          elevation={3} // Added shadow
          sx={{ 
            p: 1, 
            borderRadius: 4, 
            bgcolor: '#ffffff', // Force White Background
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 480, // Constrain width slightly for better look
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)' // Soft "Pro" Shadow
          }}
        >
          <SwapWidget 
            width={isMobile ? '100%' : 460} 
            theme={widgetTheme}
            tokenList={MY_TOKEN_LIST}
            defaultInputTokenAddress={NATIVE}
            defaultOutputTokenAddress={EBONDS_ADDRESS}
          />
        </Paper>

      </Container>
    </Box>
  );
}

export default AboutPage;