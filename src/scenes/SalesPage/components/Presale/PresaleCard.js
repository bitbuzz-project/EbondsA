import React, { useState, useEffect, useCallback } from 'react';
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
    Fade,
    LinearProgress
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// --- CONFIGURATION ---
const SALE_CONTRACT_ADDRESS = "0x3c9120a362a46dae6655fac4dffd6c07659e1c46";
const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // Arbitrum Native USDC
const HARDCAP = 1000000; // $1,000,000
const BASE_PRICE = 0.865;
const BUYBACK_TARGET = 0.90;

// Minimal ABI for Interaction
const SALE_ABI = [
    "function buyTokens(uint256 _usdcAmount) external",
    "function totalUsdcRaised() view returns (uint256)",
    "function minimumPurchaseUSDC() view returns (uint256)"
];

const USDC_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)"
];

// Bonus Logic (Matches Contract)
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
    const { account, library } = useWeb3React();
    
    // UI State
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    
    // Data State
    const [totalRaised, setTotalRaised] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState(0);

    // Auto-fill from Tier Table selection
    useEffect(() => {
        if (selectedAmount) setAmount(selectedAmount.toString());
    }, [selectedAmount]);

    // --- FETCH DATA ---
    const fetchData = useCallback(async () => {
        if (!library) return;
        try {
            const provider = library.getSigner ? library : new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, provider);
            
            // 1. Get Total Raised
            const raisedRaw = await contract.totalUsdcRaised();
            setTotalRaised(parseFloat(ethers.utils.formatUnits(raisedRaw, 6)));

            // 2. Get User Data (if connected)
            if (account) {
                const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, library.getSigner());
                
                // Balance
                const bal = await usdcContract.balanceOf(account);
                setUsdcBalance(parseFloat(ethers.utils.formatUnits(bal, 6)));

                // Allowance
                const allow = await usdcContract.allowance(account, SALE_CONTRACT_ADDRESS);
                // If allowance is huge, consider approved
                if (parseFloat(ethers.utils.formatUnits(allow, 6)) > 1000000) {
                    setIsApproved(true);
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }, [account, library]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Live updates
        return () => clearInterval(interval);
    }, [fetchData]);


    // --- ACTIONS ---

    const handleApprove = async () => {
        if (!account) return toast.error("Connect Wallet");
        try {
            setLoading(true);
            const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, library.getSigner());
            const tx = await usdcContract.approve(SALE_CONTRACT_ADDRESS, ethers.constants.MaxUint256);
            await tx.wait();
            setIsApproved(true);
            toast.success("USDC Approved!");
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Approval Failed");
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        if (!account) return toast.error("Connect Wallet");
        if (!amount || parseFloat(amount) <= 0) return toast.error("Enter amount");
        
        try {
            setLoading(true);
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, library.getSigner());
            
            // Convert to 6 decimals for USDC
            const amountInWei = ethers.utils.parseUnits(amount, 6);
            
            const tx = await contract.buyTokens(amountInWei);
            toast.info("Transaction Sent! Waiting for confirmation...");
            
            await tx.wait();
            toast.success("Purchase Successful! Welcome to the seed round.");
            
            setAmount(''); // Reset
            fetchData(); // Refresh stats
            setLoading(false);
        } catch (err) {
            console.error(err);
            // Decode error message if possible
            if (err.reason) toast.error(`Failed: ${err.reason}`);
            else toast.error("Purchase Failed");
            setLoading(false);
        }
    };

    // --- CALCULATIONS ---
    const bonusPct = getBonus(amount);
    const rawTokens = amount ? parseFloat(amount) / BASE_PRICE : 0;
    const bonusTokens = rawTokens * bonusPct;
    const totalTokens = rawTokens + bonusTokens;
    const projectedValue = totalTokens * BUYBACK_TARGET;
    
    // Progress Calculation
    const progressPct = Math.min((totalRaised / HARDCAP) * 100, 100);

    return (
        <Paper sx={{ 
            p: 4, 
            bgcolor: '#0a1019',
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
            border: '1px solid',
            borderColor: bonusPct > 0 ? '#d29d5c' : 'rgba(255,255,255,0.1)',
            boxShadow: bonusPct > 0 ? '0 0 30px rgba(210, 157, 92, 0.15)' : '0 20px 50px rgba(0,0,0,0.5)',
            position: 'sticky',
            top: 100,
            transition: 'all 0.3s ease'
        }}>
            
            {/* PROGRESS BAR SECTION */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing="0.1em">
                        SEED ROUND PROGRESS
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={700}>
                        ${totalRaised.toLocaleString()} / ${HARDCAP.toLocaleString()}
                    </Typography>
                </Stack>
                <LinearProgress 
                    variant="determinate" 
                    value={progressPct} 
                    sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #d29d5c 0%, #ffffff 100%)'
                        }
                    }} 
                />
            </Box>

            <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

            {/* Header */}
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

            {/* Input */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                        INVESTMENT AMOUNT
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Balance: {usdcBalance.toFixed(2)} USDC
                    </Typography>
                </Stack>
                
                <TextField
                    fullWidth
                    placeholder="Min 200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024" alt="USDC" width={24} />
                                    <Typography fontWeight={700} sx={{ color: 'white' }}>USDC</Typography>
                                </Box>
                            </InputAdornment>
                        ),
                        sx: { 
                            bgcolor: '#05090f', 
                            color: 'white',
                            fontFamily: '"Space Grotesk"',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            height: '60px',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1) !important' },
                            '&.Mui-focused fieldset': { borderColor: '#d29d5c !important' }
                        }
                    }}
                />
            </Box>

            {/* Invoice */}
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

            {/* Action Buttons */}
            {!isApproved ? (
                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    disabled={loading || !account}
                    onClick={handleApprove}
                    sx={{ py: 2.5, fontSize: '1.1rem', borderColor: '#d29d5c', color: '#d29d5c', '&:hover': { bgcolor: 'rgba(210,157,92,0.1)' } }}
                >
                    {loading ? 'Approving...' : '1. Approve USDC'}
                </Button>
            ) : (
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || !amount || parseFloat(amount) < 200}
                    onClick={handleBuy}
                    sx={{ 
                        py: 2.5, 
                        fontSize: '1.1rem',
                        background: loading ? 'grey' : 'linear-gradient(45deg, #d29d5c 30%, #e3b578 90%)',
                        boxShadow: '0 4px 20px rgba(210, 157, 92, 0.4)'
                    }}
                >
                    {loading ? 'Processing...' : '2. Confirm Allocation'}
                </Button>
            )}

            {!account && (
                <Typography variant="caption" align="center" display="block" sx={{ mt: 2, color: 'error.main' }}>
                    * Please connect your wallet to participate
                </Typography>
            )}

        </Paper>
    );
};

export default PresaleCard;