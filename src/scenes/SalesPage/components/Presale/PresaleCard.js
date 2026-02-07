import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Paper, Typography, Button, TextField, InputAdornment, 
    Divider, Stack, LinearProgress, CircularProgress 
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { SALE_ABI, TOKEN_ABI } from '../../../../consts/abi';

// --- MAINNET CONFIGURATION ---
const SALE_CONTRACT_ADDRESS = "0x20f91eadf33cd3b9f60d35e6880445cca2ccb33d";
const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const HARDCAP = 1000000;

const PresaleCard = ({ selectedAmount }) => {
    const { account, library } = useWeb3React();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    
    const [totalRaised, setTotalRaised] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState(0);
    const [minPurchase, setMinPurchase] = useState(200);
    const [priceNumerator, setPriceNumerator] = useState(865);
    const [bonusPct, setBonusPct] = useState(0);

    const [vestingInfo, setVestingInfo] = useState({
        purchased: 0,
        claimable: 0,
        progress: 0
    });

    useEffect(() => {
        if (selectedAmount) setAmount(selectedAmount.toString());
    }, [selectedAmount]);

    const fetchData = useCallback(async () => {
        if (!library) return;
        try {
            const provider = library.getSigner ? library : new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
            const saleContract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, provider);
            
            const [raised, min, price] = await Promise.all([
                saleContract.totalUsdcRaised(),
                saleContract.minimumPurchaseUSDC(),
                saleContract.priceNumerator()
            ]);

            setTotalRaised(parseFloat(ethers.utils.formatUnits(raised, 6)));
            setMinPurchase(parseFloat(ethers.utils.formatUnits(min, 6)));
            setPriceNumerator(price.toNumber());

            if (amount && parseFloat(amount) > 0) {
                const bonus = await saleContract.getBonusPercentage(ethers.utils.parseUnits(amount, 6));
                setBonusPct(bonus.toNumber() / 10000);
            } else {
                setBonusPct(0);
            }

            if (account) {
                const usdcContract = new ethers.Contract(USDC_ADDRESS, TOKEN_ABI, library.getSigner());
                const [bal, allow, info] = await Promise.all([
                    usdcContract.balanceOf(account),
                    usdcContract.allowance(account, SALE_CONTRACT_ADDRESS),
                    saleContract.getVestingInfo(account)
                ]);

                setUsdcBalance(parseFloat(ethers.utils.formatUnits(bal, 6)));
                setIsApproved(parseFloat(ethers.utils.formatUnits(allow, 6)) >= parseFloat(amount));
                setVestingInfo({
                    purchased: parseFloat(ethers.utils.formatUnits(info.purchased, 18)),
                    claimable: parseFloat(ethers.utils.formatUnits(info.claimable, 18)),
                    progress: info.progress.toNumber()
                });
            }
        } catch (error) {
            console.error("Sync Error:", error);
        }
    }, [account, library, amount]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

   const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) return toast.error("Enter a valid amount first");
    
    try {
        setLoading(true);
        const usdcContract = new ethers.Contract(USDC_ADDRESS, TOKEN_ABI, library.getSigner());
        
        // Convert the input amount to the correct 6-decimal format for USDC
        const amountToApprove = ethers.utils.parseUnits(amount, 6);
        
        const tx = await usdcContract.approve(SALE_CONTRACT_ADDRESS, amountToApprove);
        await tx.wait();
        
        setIsApproved(true);
        toast.success(`Approved ${amount} USDC!`);
    } catch (err) {
        toast.error("Approval Failed");
    } finally { 
        setLoading(false); 
    }
};

    const handleBuy = async () => {
        if (parseFloat(amount) < minPurchase) return toast.error(`Min $${minPurchase} USDC`);
        try {
            setLoading(true);
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, library.getSigner());
            const tx = await contract.buyTokens(ethers.utils.parseUnits(amount, 6));
            await tx.wait();
            toast.success("Allocation Successful!");
            setAmount('');
            fetchData();
        } catch (err) {
            toast.error("Transaction Failed");
        } finally { setLoading(false); }
    };

    const handleClaim = async () => {
        try {
            setClaiming(true);
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, library.getSigner());
            const tx = await contract.claimTokens();
            await tx.wait();
            toast.success("Tokens Claimed!");
            fetchData();
        } catch (err) {
            toast.error("Claim Failed");
        } finally { setClaiming(false); }
    };

    const basePrice = priceNumerator / 1000;
    const rawTokens = amount ? parseFloat(amount) / basePrice : 0;
    const totalTokens = rawTokens * (1 + bonusPct);
    const progressPct = Math.min((totalRaised / HARDCAP) * 100, 100);

    return (
        <Paper sx={{ p: 4, bgcolor: '#0a1019', border: '1px solid', borderColor: bonusPct > 0 ? '#d29d5c' : 'rgba(255,255,255,0.1)', position: 'sticky', top: 100 }}>
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>SEED PROGRESS</Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={700}>${totalRaised.toLocaleString()} / ${HARDCAP.toLocaleString()}</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={progressPct} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #d29d5c 0%, #ffffff 100%)' } }} />
            </Box>

            <Typography variant="overline" color="text.secondary" fontWeight={700}>ORDER ENTRY</Typography>
            <Typography variant="h4" fontWeight={700} color="white" sx={{ mb: 3 }}>Initialize Allocation</Typography>

            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">ALLOCATION AMOUNT</Typography>
                    <Typography variant="caption" color="text.secondary">Balance: {usdcBalance.toFixed(2)} USDC</Typography>
                </Stack>
                <TextField fullWidth placeholder={`Min ${minPurchase}`} value={amount} onChange={(e) => setAmount(e.target.value)}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Typography fontWeight={700} color="white">USDC</Typography></InputAdornment>, sx: { bgcolor: '#05090f', color: 'white', fontWeight: 700, fontSize: '1.2rem' } }}
                />
            </Box>

            <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="white" fontWeight={700}>Total Tokens</Typography>
                        <Typography variant="body1" fontWeight={700} color="white">{totalTokens.toLocaleString(undefined, {maximumFractionDigits:0})} EBONDS</Typography>
                    </Stack>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>VESTING PARAMETERS</Typography>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}><Typography variant="body2" color="white">Schedule</Typography><Typography variant="body2" fontWeight={600} color="primary.main">90-Day Linear</Typography></Stack>
                        <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Unlock Type</Typography><Typography variant="body2" color="text.secondary">Continuous / Second</Typography></Stack>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(210, 157, 92, 0.05)', borderRadius: 2, border: '1px dashed rgba(210, 157, 92, 0.3)', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <LockIcon sx={{ fontSize: 24, color: '#d29d5c', mt: 0.5 }} />
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="white" gutterBottom>Systematic Vesting Schedule</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
                        To ensure stability, all seeded EBONDS are subject to:<br />
                        • <strong>90-Day Linear Vesting:</strong> Unlocks continuously starting from purchase.<br />
                        • <strong>Weighted Averaging:</strong> Multiple allocations adjust the end-time.
                    </Typography>
                </Box>
            </Box>

            {!isApproved ? (
                <Button fullWidth variant="outlined" onClick={handleApprove} disabled={loading || !account} sx={{ py: 2, borderColor: '#d29d5c', color: '#d29d5c', fontWeight: 700 }}>{loading ? 'Approving...' : '1. Approve USDC'}</Button>
            ) : (
                <Button fullWidth variant="contained" onClick={handleBuy} disabled={loading || !amount} sx={{ py: 2, fontWeight: 700, background: 'linear-gradient(45deg, #d29d5c, #e3b578)' }}>{loading ? 'Processing...' : '2. Confirm Allocation'}</Button>
            )}

            {account && vestingInfo.purchased > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="caption" color="text.secondary">CLAIMABLE</Typography>
                            <Typography variant="h6" color="white">{vestingInfo.claimable.toFixed(2)} EBONDS</Typography>
                        </Box>
                        <Button variant="contained" size="small" onClick={handleClaim} disabled={claiming || vestingInfo.claimable <= 0} sx={{ bgcolor: '#4caf50' }}>{claiming ? '...' : 'Claim'}</Button>
                    </Stack>
                    <LinearProgress variant="determinate" value={vestingInfo.progress} sx={{ mt: 1, height: 4, borderRadius: 2 }} />
                </Box>
            )}
        </Paper>
    );
};

export default PresaleCard;