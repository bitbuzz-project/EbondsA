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
  InputAdornment,
  Alert
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimerIcon from '@mui/icons-material/Timer';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { toast } from 'react-toastify';

const PresaleCard = () => {
  const [amount, setAmount] = useState('');
  
  // Configuration for the new sale structure
  const saleConfig = {
    basePrice: 0.865, // $0.865 base price
    buybackTarget: 0.90, // $0.90 buyback target
    hardCap: 1000000, // $1M hard cap
    raised: 245000, // Mock raised amount
    minBuy: 2000, // $2000 min for tiered bonuses
  };

  // Tiered bonus calculation
  const calculateBonus = (investmentAmount) => {
    if (investmentAmount < 2000) return 0;
    if (investmentAmount < 5000) return 10.3;
    if (investmentAmount < 10000) return 14.5;
    if (investmentAmount < 20000) return 18.6;
    if (investmentAmount < 40000) return 20.7;
    if (investmentAmount < 60000) return 24.9;
    if (investmentAmount < 100000) return 26.9;
    if (investmentAmount < 150000) return 31.1;
    if (investmentAmount < 200000) return 35.3;
    if (investmentAmount < 400000) return 39.4;
    return 45.7;
  };

  const investAmount = amount ? parseFloat(amount) : 0;
  const bonusPercent = calculateBonus(investAmount);
  const baseTokens = investAmount / saleConfig.basePrice;
  const bonusTokens = baseTokens * (bonusPercent / 100);
  const totalTokens = baseTokens + bonusTokens;
  const profitAtBuyback = totalTokens * saleConfig.buybackTarget - investAmount;
  const roiPercent = investAmount > 0 ? (profitAtBuyback / investAmount) * 100 : 0;

  const handleBuy = () => {
    if(!amount || parseFloat(amount) < saleConfig.minBuy) {
        toast.error(`Minimum purchase is $${saleConfig.minBuy}`);
        return;
    }
    toast.info("Connecting to smart contract...");
    // Add your contract integration here
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.05)', overflow: 'visible' }}>
      <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Background Pattern */}
        <RocketLaunchIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 150, opacity: 0.2, transform: 'rotate(-45deg)' }} />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Box>
                <Chip 
                  label="Live Now" 
                  color="secondary" 
                  size="small" 
                  icon={<SmartToyIcon />}
                  sx={{ mb: 1, fontWeight: 700 }} 
                />
                <Typography variant="h4" fontWeight={800}>Bot-Powered Sale Round</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Automated BTC & LINK trading with 35-50% expected returns
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Base Price</Typography>
                <Typography variant="h5" fontWeight={700}>${saleConfig.basePrice}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Buyback Target</Typography>
                <Typography variant="h6" fontWeight={700} color="success.light">${saleConfig.buybackTarget}</Typography>
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

        {/* Bot Strategy Alert */}
        <Alert severity="info" icon={<SmartToyIcon />} sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            40% BTC Bot (24% APY) + 60% LINK Bot (60% APY) = 35-50% Combined Returns
          </Typography>
        </Alert>

        <GridContainer>
             {/* Left: Purchase Input */}
             <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Enter Contribution (USDT)</Typography>
                <TextField 
                    fullWidth
                    placeholder="10000"
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
                    Min Allocation: ${saleConfig.minBuy.toLocaleString()} • Tiered bonuses up to 45.7%
                </Typography>
             </Box>

             {/* Right: Simulation */}
             <Box sx={{ flex: 1, bgcolor: 'background.default', p: 3, borderRadius: 3, border: '2px solid', borderColor: 'divider' }}>
                <Stack spacing={2}>
                    <Row label="Base Tokens" value={baseTokens.toLocaleString(undefined, {maximumFractionDigits: 0})} />
                    <Row 
                        label={`Tier Bonus (${bonusPercent.toFixed(1)}%)`} 
                        value={`+ ${bonusTokens.toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
                        highlight 
                        icon={<LocalOfferIcon sx={{ fontSize: 14 }} />} 
                    />
                    <Divider />
                    <Row 
                      label="Total EBONDS" 
                      value={totalTokens.toLocaleString(undefined, {maximumFractionDigits: 0})} 
                      isTotal 
                    />
                    
                    {investAmount >= saleConfig.minBuy && (
                      <>
                        <Divider />
                        <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'success.main' }}>
                          <Typography variant="caption" color="success.dark" fontWeight={600} display="block">
                            Profit at $0.90 Buyback
                          </Typography>
                          <Typography variant="h6" fontWeight={800} color="success.dark">
                            ${profitAtBuyback.toLocaleString(undefined, {maximumFractionDigits: 0})}
                          </Typography>
                          <Chip 
                            label={`${roiPercent.toFixed(1)}% ROI`} 
                            size="small" 
                            color="success" 
                            sx={{ mt: 1, fontWeight: 700 }} 
                          />
                        </Box>
                      </>
                    )}
                </Stack>
             </Box>
        </GridContainer>

        {/* Bot Strategy Info */}
        <Box sx={{ mt: 3, p: 3, bgcolor: 'info.light', borderRadius: 3, border: '1px solid', borderColor: 'info.main' }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <SmartToyIcon color="info" fontSize="small" />
              <Typography variant="body2" color="info.dark" fontWeight={600}>
                Revenue allocation: 40% Bitcoin Bot + 60% LINK Bot
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TimerIcon color="info" fontSize="small" />
              <Typography variant="body2" color="info.dark">
                Bot profits directed to EBONDS liquidity buildup & buybacks at $0.90 target
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            sx={{ mt: 4, borderRadius: 3, py: 2, fontSize: '1.1rem', fontWeight: 800 }}
            onClick={handleBuy}
            disabled={!amount || parseFloat(amount) < saleConfig.minBuy}
        >
            Participate with {bonusPercent.toFixed(1)}% Bonus
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          🎯 Goal: Double buyback capacity through automated volatility harnessing
        </Typography>

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