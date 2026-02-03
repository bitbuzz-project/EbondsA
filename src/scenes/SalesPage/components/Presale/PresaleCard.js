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
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import LockIcon from '@mui/icons-material/Lock'; // Import LockIcon for vesting section
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// --- CONFIGURATION ---
const SALE_CONTRACT_ADDRESS = "0x3c9120a362a46dae6655fac4dffd6c07659e1c46";
const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const HARDCAP = 1000000; 
const BASE_PRICE = 0.865;

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
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [totalRaised, setTotalRaised] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState(0);
    const [minPurchase, setMinPurchase] = useState(200);

    useEffect(() => {
        if (selectedAmount) setAmount(selectedAmount.toString());
    }, [selectedAmount]);

    const fetchData = useCallback(async () => {
        if (!library) return;
        try {
            const provider = library.getSigner ? library : new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, provider);
            
            const raisedRaw = await contract.totalUsdcRaised();
            setTotalRaised(parseFloat(ethers.utils.formatUnits(raisedRaw, 6)));

            const minRaw = await contract.minimumPurchaseUSDC();
            setMinPurchase(parseFloat(ethers.utils.formatUnits(minRaw, 6)));

            if (account) {
                const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, library.getSigner());
                const bal = await usdcContract.balanceOf(account);
                setUsdcBalance(parseFloat(ethers.utils.formatUnits(bal, 6)));

                const allow = await usdcContract.allowance(account, SALE_CONTRACT_ADDRESS);
                if (parseFloat(ethers.utils.formatUnits(allow, 6)) >= 1000000) {
                    setIsApproved(true);
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }, [account, library]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleApprove = async () => {
        if (!account) return toast.error("Connect Wallet");
        try {
            setLoading(true);
            const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, library.getSigner());
            const tx = await usdcContract.approve(SALE_CONTRACT_ADDRESS, ethers.constants.MaxUint256);
            await tx.wait();
            setIsApproved(true);
            toast.success("USDC Approved!");
        } catch (err) {
            toast.error("Approval Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        if (!account) return toast.error("Connect Wallet");
        const numericAmount = parseFloat(amount);
        if (!amount || numericAmount < minPurchase) {
            return toast.error(`Minimum purchase is $${minPurchase} USDC`);
        }
        
        try {
            setLoading(true);
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, library.getSigner());
            const tx = await contract.buyTokens(ethers.utils.parseUnits(amount, 6));
            toast.info("Initialising Allocation...");
            await tx.wait();
            toast.success("Allocation Successful!");
            setAmount('');
            fetchData();
        } catch (err) {
            const errorMsg = err.data?.message || err.reason || "Transaction Failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const bonusPct = getBonus(amount);
    const rawTokens = amount ? parseFloat(amount) / BASE_PRICE : 0;
    const totalTokens = rawTokens * (1 + bonusPct);
    const progressPct = Math.min((totalRaised / HARDCAP) * 100, 100);

    return (
        <Paper sx={{ 
            p: 4, bgcolor: '#0a1019', border: '1px solid',
            borderColor: bonusPct > 0 ? '#d29d5c' : 'rgba(255,255,255,0.1)',
            position: 'sticky', top: 100
        }}>
            {/* SEED PROGRESS */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>SEED PROGRESS</Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={700}>
                        ${totalRaised.toLocaleString()} / ${HARDCAP.toLocaleString()}
                    </Typography>
                </Stack>
                <LinearProgress 
                    variant="determinate" 
                    value={progressPct} 
                    sx={{ 
                        height: 8, borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #d29d5c 0%, #ffffff 100%)' }
                    }} 
                />
            </Box>

            <Typography variant="overline" color="text.secondary" fontWeight={700}>ORDER ENTRY</Typography>
            <Typography variant="h4" fontWeight={700} color="white" sx={{ mb: 3 }}>Initialize Allocation</Typography>

            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em' }}>
                        ALLOCATION AMOUNT
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Balance: {usdcBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDC
                    </Typography>
                </Stack>
                <TextField
                    fullWidth placeholder={`Min ${minPurchase}`} value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Typography fontWeight={700} color="white">USDC</Typography></InputAdornment>,
                        sx: { 
                            bgcolor: '#05090f', color: 'white', fontWeight: 700, fontSize: '1.2rem',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1) !important' }
                        }
                    }}
                />
            </Box>

            {/* INVOICE & INTERNAL VESTING PARAMETERS */}
            <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="white" fontWeight={700}>Total Tokens</Typography>
                        <Typography variant="body1" fontWeight={700} color="white">
                            {totalTokens.toLocaleString(undefined, {maximumFractionDigits:0})} EBONDS
                        </Typography>
                    </Stack>
                    
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                    
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: '0.05em' }}>
                            VESTING PARAMETERS
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="body2" color="white">Schedule</Typography>
                            <Typography variant="body2" fontWeight={600} color="primary.main">90-Day Linear</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Unlock Type</Typography>
                            <Typography variant="body2" color="text.secondary">Continuous / Second</Typography>
                        </Stack>
                    </Box>
                </Stack>
            </Box>

            {/* SYSTEMATIC VESTING SCHEDULE CARD (INTEGRATED) */}
            <Box sx={{ 
                mb: 3, p: 2, 
                bgcolor: 'rgba(210, 157, 92, 0.05)', 
                borderRadius: 2, 
                border: '1px dashed rgba(210, 157, 92, 0.3)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2
            }}>
                <LockIcon sx={{ fontSize: 24, color: '#d29d5c', mt: 0.5 }} />
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="white" gutterBottom>
                        Systematic Vesting Schedule
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
                        To ensure stability, all seeded EBONDS are subject to:
                        <br />
                        • <strong>90-Day Linear Vesting:</strong> Unlocks continuously starting from purchase.
                        <br />
                        • <strong>Weighted Averaging:</strong> Multiple allocations adjust the end-time to preserve system integrity.
                    </Typography>
                </Box>
            </Box>

            {!isApproved ? (
                <Button 
                    fullWidth variant="outlined" size="large" onClick={handleApprove} 
                    disabled={loading || !account} 
                    sx={{ py: 2, borderColor: '#d29d5c', color: '#d29d5c', fontWeight: 700 }}
                >
                    {loading ? 'Approving...' : '1. Approve USDC'}
                </Button>
            ) : (
                <Button 
                    fullWidth variant="contained" size="large" onClick={handleBuy} 
                    disabled={loading || parseFloat(amount) < minPurchase} 
                    sx={{ 
                        py: 2, fontWeight: 700,
                        background: 'linear-gradient(45deg, #d29d5c, #e3b578)',
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