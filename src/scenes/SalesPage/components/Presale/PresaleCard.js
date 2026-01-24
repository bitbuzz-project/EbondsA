import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Button, 
    TextField, 
    InputAdornment, 
    Divider,
    Stack,
    Chip,
    Fade
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

// CSV Data Constants
const BASE_PRICE = 0.865;
const BUYBACK_TARGET = 0.90;

// Bonus Tiers logic
const getBonus = (amount) => {
    const val = parseFloat(amount);
    if (!val) return 0;
    if (val >= 400000) return 0.30;
    if (val >= 280000) return 0.24;
    if (val >= 160000) return 0.20;
    if (val >= 80000) return 0.16;
    if (val >= 40000) return 0.12;
    if (val >= 20000) return 0.10;
    if (val >= 10000) return 0.08;
    if (val >= 5000) return 0.06;
    if (val >= 2000) return 0.03;
    return 0;
};

const PresaleCard = ({ selectedAmount }) => {
    const { account } = useWeb3React();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-fill from Tier Table selection
    useEffect(() => {
        if (selectedAmount) setAmount(selectedAmount.toString());
    }, [selectedAmount]);

    const bonusPct = getBonus(amount);
    const rawTokens = amount ? parseFloat(amount) / BASE_PRICE : 0;
    const bonusTokens = rawTokens * bonusPct;
    const totalTokens = rawTokens + bonusTokens;
    
    // Projected Value at $0.90 Target
    const projectedValue = totalTokens * BUYBACK_TARGET;
    const profit = amount ? projectedValue - parseFloat(amount) : 0;

    const handleBuy = async () => {
        if (!account) return toast.error("Connect Wallet First");
        setLoading(true);
        // Mocking the contract interaction
        setTimeout(() => {
            setLoading(false);
            toast.success(`Purchase of ${totalTokens.toFixed(2)} EBONDS recorded (Mock)`);
        }, 2000);
    };

    return (
        <Paper sx={{ 
            p: 4, 
            bgcolor: '#0a1019',
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
            border: '1px solid',
            borderColor: bonusPct > 0 ? '#d29d5c' : 'rgba(255,255,255,0.1)',
            boxShadow: bonusPct > 0 ? '0 0 30px rgba(210, 157, 92, 0.15)' : '0 20px 50px rgba(0,0,0,0.5)',
            position: 'sticky',
            top: 24,
            transition: 'all 0.3s ease'
        }}>
            
            {/* Header with Live Status */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Order Entry
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="white">
                        Buy EBONDS
                    </Typography>
                </Box>
                {bonusPct > 0 && (
                    <Fade in={true}>
                        <Chip 
                            icon={<ElectricBoltIcon />} 
                            label="BONUS ACTIVE" 
                            color="primary" 
                            sx={{ fontWeight: 800 }} 
                        />
                    </Fade>
                )}
            </Box>

            {/* The "Terminal" Input */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', letterSpacing: '0.1em' }}>
                   ALLOCATION (USDC)
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Min 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography fontWeight={700} sx={{ color: 'white' }}>USDC</Typography>
                            </InputAdornment>
                        ),
                        sx: { 
                            bgcolor: '#05090f', 
                            color: 'white',
                            fontFamily: '"Space Grotesk"',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            height: '60px',
                            '& fieldset': { 
                                borderColor: 'rgba(255,255,255,0.1) !important',
                                borderWidth: '1px !important'
                            },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3) !important' },
                            '&.Mui-focused fieldset': { borderColor: '#d29d5c !important' }
                        }
                    }}
                />
            </Box>

            {/* The "Invoice" Section */}
            <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Base Tokens</Typography>
                        <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                            {rawTokens.toLocaleString(undefined, {maximumFractionDigits:2})}
                        </Typography>
                    </Stack>
                    
                    {bonusPct > 0 && (
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="primary.main">Bonus Tokens (+{bonusPct * 100}%)</Typography>
                            <Typography variant="body2" fontWeight={600} fontFamily="monospace" color="primary.main">
                                +{bonusTokens.toLocaleString(undefined, {maximumFractionDigits:2})}
                            </Typography>
                        </Stack>
                    )}

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" color="white" fontWeight={700}>Total Receive</Typography>
                        <Typography variant="h5" fontWeight={700} color="white">
                            {totalTokens.toLocaleString(undefined, {maximumFractionDigits:0})} <span style={{fontSize: '0.8rem', color:'#94a3b8'}}>EBONDS</span>
                        </Typography>
                    </Stack>
                </Stack>
            </Box>

            {/* Profit Projection */}
            <Box sx={{ mb: 4, px: 2, py: 1, bgcolor: 'rgba(74, 222, 128, 0.05)', borderRadius: 1, border: '1px dashed rgba(74, 222, 128, 0.3)', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="success.main" fontWeight={600}>
                    EST. VALUE @ $0.90
                </Typography>
                <Typography variant="caption" color="success.main" fontWeight={700} fontFamily="monospace">
                    ${projectedValue.toLocaleString(undefined, {maximumFractionDigits:2})}
                </Typography>
            </Box>

            <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !amount || parseFloat(amount) < 100}
                onClick={handleBuy}
                sx={{ 
                    py: 2.5, 
                    fontSize: '1.1rem',
                    background: loading ? 'grey' : 'linear-gradient(45deg, #d29d5c 30%, #e3b578 90%)',
                    boxShadow: '0 4px 20px rgba(210, 157, 92, 0.4)'
                }}
            >
                {loading ? 'Processing...' : 'Confirm Allocation'}
            </Button>

        </Paper>
    );
};

export default PresaleCard;