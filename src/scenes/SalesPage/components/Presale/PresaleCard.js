import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Divider, 
  Chip,
  LinearProgress,
  InputAdornment
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimerIcon from '@mui/icons-material/Timer';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { toast } from 'react-toastify';

const PresaleCard = () => {
  const [amount, setAmount] = useState('');
  
  // Configuration for the "Special Sale"
  const saleConfig = {
    price: 0.05, // $0.05 per EBONDS
    bonusPercent: 15, // 15% Bonus
    vestingMonths: 6,
    hardCap: 500000,
    raised: 125000, // Mock raised amount
    minBuy: 100, // $100 min
  };

  const tokenAmount = amount ? parseFloat(amount) / saleConfig.price : 0;
  const bonusAmount = tokenAmount * (saleConfig.bonusPercent / 100);
  const totalTokens = tokenAmount + bonusAmount;

  const handleBuy = () => {
    if(!amount || parseFloat(amount) < saleConfig.minBuy) {
        toast.error(`Minimum purchase is $${saleConfig.minBuy}`);
        return;
    }
    toast.info("Contract integration coming soon!");
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.05)', overflow: 'visible' }}>
      <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Background Pattern */}
        <RocketLaunchIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 150, opacity: 0.2, transform: 'rotate(-45deg)' }} />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Box>
                <Chip label="Live Now" color="secondary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
                <Typography variant="h4" fontWeight={800}>Special Community Sale</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Exclusive round with {saleConfig.bonusPercent}% Bonus Tokens
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Current Price</Typography>
                <Typography variant="h5" fontWeight={700}>${saleConfig.price}</Typography>
            </Box>
        </Stack>
      </Box>

      <CardContent sx={{ p: 4 }}>
        
        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">Total Raised</Typography>
                <Typography variant="body2" fontWeight={700} color="primary.main">
                    ${saleConfig.raised.toLocaleString()} / ${saleConfig.hardCap.toLocaleString()}
                </Typography>
            </Stack>
            <LinearProgress 
                variant="determinate" 
                value={(saleConfig.raised / saleConfig.hardCap) * 100} 
                sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover' }}
            />
        </Box>

        <GridContainer>
             {/* Left: Purchase Input */}
             <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Enter Contribution (USDT)</Typography>
                <TextField 
                    fullWidth
                    placeholder="1000"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <Typography fontWeight={700} color="text.secondary">USDT</Typography>,
                        sx: { borderRadius: 2, fontWeight: 700, fontSize: '1.2rem' }
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Min Allocation: ${saleConfig.minBuy}
                </Typography>
             </Box>

             {/* Right: Simulation */}
             <Box sx={{ flex: 1, bgcolor: 'background.default', p: 2, borderRadius: 3 }}>
                <Stack spacing={2}>
                    <Row label="Base Tokens" value={tokenAmount.toLocaleString()} />
                    <Row 
                        label={`Bonus (${saleConfig.bonusPercent}%)`} 
                        value={`+ ${bonusAmount.toLocaleString()}`} 
                        highlight 
                        icon={<LocalOfferIcon sx={{ fontSize: 14 }} />} 
                    />
                    <Divider />
                    <Row label="Total You Receive" value={totalTokens.toLocaleString()} isTotal />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                        <TimerIcon color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                            Vesting: Linear release over {saleConfig.vestingMonths} months
                        </Typography>
                    </Box>
                </Stack>
             </Box>
        </GridContainer>

        <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            sx={{ mt: 4, borderRadius: 3, py: 2, fontSize: '1.1rem', fontWeight: 800 }}
            onClick={handleBuy}
        >
            Buy EBONDS with {saleConfig.bonusPercent}% Bonus
        </Button>

      </CardContent>
    </Card>
  );
};

// Helper Components
const Row = ({ label, value, highlight, isTotal, icon }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color={highlight ? "success.main" : "text.secondary"} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {icon} {label}
        </Typography>
        <Typography variant={isTotal ? "h6" : "body1"} fontWeight={isTotal ? 800 : 600} color={highlight ? "success.main" : "text.primary"}>
            {value} {isTotal && "EBONDS"}
        </Typography>
    </Stack>
);

const GridContainer = ({ children }) => (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {children}
    </Box>
);

export default PresaleCard;