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

// --- CONFIGURATION ---
const SALE_CONTRACT_ADDRESS = "0x8e7B98F0eAC02dB3977fC4c4A79D3E1850c299fA";
const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const HARDCAP = 1000000;
const EXCLUSIVE_VIEWER = "0x0d9C0C5B544eed0367D88aAc5Cf7671ba3946c6E";

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
    const [estimatedTokens, setEstimatedTokens] = useState(0);

    const [vestingInfo, setVestingInfo] = useState({
        purchased: 0,
        claimed: 0,
        claimable: 0,
        locked: 0,
        progress: 0,
        daysRemaining: 0
    });

    // Permission check: visible if user has tokens OR is the exclusive viewer address
    const canSeeInvestment = account && (
        vestingInfo.purchased > 0 || 
        account.toLowerCase() === EXCLUSIVE_VIEWER.toLowerCase()
    );

    const sendTelegramAlert = async (buyerAddress, amount) => {
        const BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
        const CHAT_IDS = [
            process.env.REACT_APP_TELEGRAM_CHAT_ID_1,
            process.env.REACT_APP_TELEGRAM_CHAT_ID_2
        ].filter(id => id !== undefined && id !== ""); 

        if (!BOT_TOKEN || CHAT_IDS.length === 0) return;

        const message = `🚀 **New Allocation!**\n\n👤 Buyer: ${buyerAddress}\n💰 Amount: ${amount} USDC\n🌐 Network: Arbitrum One`;
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        for (const chatId of CHAT_IDS) {
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
                });
            } catch (err) { console.error("Telegram Alert Failed", err); }
        }
    };

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

            if (account) {
                const usdcContract = new ethers.Contract(USDC_ADDRESS, TOKEN_ABI, library.getSigner());
                const [bal, allow, info] = await Promise.all([
                    usdcContract.balanceOf(account),
                    usdcContract.allowance(account, SALE_CONTRACT_ADDRESS),
                    saleContract.getVestingInfo(account)
                ]);

                /** * v4 Contract returns 7 values: 
                 * [0]claimableAmount, [1]vestingAmount, [2]vestedFromSchedule, [3]totalClaimable, 
                 * [4]totalClaimed, [5]vestingStartTime, [6]vestingEndTime 
                 */
                const poolClaimable = info[0];
                const vAmount = info[1];
                const vFromSchedule = info[2];
                const totalClaimable = info[3];
                const totalClaimed = info[4];
                const vStart = info[5];
                const vEnd = info[6];

                const now = Math.floor(Date.now() / 1000);
                const days = vEnd.gt(now) ? Math.ceil((vEnd.toNumber() - now) / 86400) : 0;

                // Calculate manual progress based on start and end times
                let progress = 0;
                if (vEnd.gt(vStart)) {
                    progress = Math.min(100, ((now - vStart.toNumber()) / (vEnd.toNumber() - vStart.toNumber())) * 100);
                    if (progress < 0) progress = 0;
                }

                setUsdcBalance(parseFloat(ethers.utils.formatUnits(bal, 6)));
                setIsApproved(parseFloat(ethers.utils.formatUnits(allow, 6)) >= parseFloat(amount || 0));
                
                setVestingInfo({
                    purchased: parseFloat(ethers.utils.formatUnits(poolClaimable.add(vAmount), 18)),
                    claimed: parseFloat(ethers.utils.formatUnits(totalClaimed, 18)),
                    claimable: parseFloat(ethers.utils.formatUnits(totalClaimable, 18)),
                    locked: parseFloat(ethers.utils.formatUnits(vAmount.sub(vFromSchedule), 18)),
                    progress: progress,
                    daysRemaining: days
                });
            }

            // Get dynamic quote for the input amount
            if (amount && parseFloat(amount) >= minPurchase) {
                const quote = await saleContract.getQuote(ethers.utils.parseUnits(amount, 6));
                setEstimatedTokens(parseFloat(ethers.utils.formatUnits(quote.totalTokens, 18)));
                setBonusPct(quote.bonusPercent.toNumber() / 10000);
            } else {
                setEstimatedTokens(0);
                setBonusPct(0);
            }

        } catch (error) { console.error("Sync Error:", error); }
    }, [account, library, amount, minPurchase]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    useEffect(() => {
        if (selectedAmount) setAmount(selectedAmount.toString());
    }, [selectedAmount]);

    const handleApprove = async () => {
        if (!amount || parseFloat(amount) <= 0) return toast.error("Enter a valid amount first");
        try {
            setLoading(true);
            const usdcContract = new ethers.Contract(USDC_ADDRESS, TOKEN_ABI, library.getSigner());
            const tx = await usdcContract.approve(SALE_CONTRACT_ADDRESS, ethers.utils.parseUnits(amount, 6));
            await tx.wait();
            setIsApproved(true);
            toast.success(`Approved ${amount} USDC!`);
            fetchData();
        } catch (err) { toast.error("Approval Failed"); }
        finally { setLoading(false); }
    };

    const handleBuy = async () => {
        if (parseFloat(amount) < minPurchase) return toast.error(`Min $${minPurchase} USDC`);
        try {
            setLoading(true);
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, library.getSigner());
            
            // Check contract validation
            const [isValid, message] = await contract.canPurchase(ethers.utils.parseUnits(amount, 6));
            if (!isValid) return toast.error(message);

            const tx = await contract.buyTokens(ethers.utils.parseUnits(amount, 6));
            await tx.wait();
            sendTelegramAlert(account, amount);
            toast.success("Allocation Successful!");
            setAmount('');
            fetchData();
        } catch (err) { toast.error("Transaction Failed"); }
        finally { setLoading(false); }
    };

    const handleClaim = async () => {
        try {
            setClaiming(true);
            const contract = new ethers.Contract(SALE_CONTRACT_ADDRESS, SALE_ABI, library.getSigner());
            const tx = await contract.claimTokens();
            await tx.wait();
            toast.success("Tokens Claimed!");
            fetchData();
        } catch (err) { toast.error("Claim Failed"); }
        finally { setClaiming(false); }
    };

    const progressPct = Math.min((totalRaised / HARDCAP) * 100, 100);

    return (
        <Box sx={{ position: 'sticky', top: 100 }}>
            
            {/* 1. INVESTMENT SUMMARY (AT TOP) */}
            {canSeeInvestment && (
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(210, 157, 92, 0.1)', border: '2px solid #d29d5c', borderRadius: 2 }}>
                    <Typography variant="overline" color="primary.main" fontWeight={800} sx={{ display: 'block', mb: 2 }}>
                        MY SEED SUMMARY
                    </Typography>
                    
                    <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Total EBONDS with bonus</Typography>
                            <Typography variant="body2" color="white" fontWeight={700}>{vestingInfo.purchased.toLocaleString()} EBONDS</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Still locked</Typography>
                            <Typography variant="body2" color="#ff9800" fontWeight={700}>{vestingInfo.locked.toLocaleString()} EBONDS</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Claimed</Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={700}>{vestingInfo.claimed.toLocaleString()} EBONDS</Typography>
                        </Stack>

                        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.05)' }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="caption" color="text.secondary">AVAILABLE TO CLAIM</Typography>
                                <Typography variant="h5" color="#4caf50" fontWeight={800}>
                                    {vestingInfo.claimable.toFixed(2)}
                                </Typography>
                            </Box>
                            <Button variant="contained" onClick={handleClaim} disabled={claiming || vestingInfo.claimable <= 0} sx={{ bgcolor: '#4caf50', fontWeight: 700 }}>
                                {claiming ? '...' : 'CLAIM'}
                            </Button>
                        </Stack>

                        <Box sx={{ mt: 1 }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">Vesting Progress</Typography>
                                <Typography variant="caption" color="primary.main" fontWeight={700}>{vestingInfo.daysRemaining} Days Until Fully Vested</Typography>
                            </Stack>
                            <LinearProgress variant="determinate" value={vestingInfo.progress} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#d29d5c' } }} />
                        </Box>
                    </Stack>
                </Paper>
            )}

            {/* 2. MAIN PURCHASE CARD */}
            <Paper sx={{ p: 4, bgcolor: '#0a1019', border: '1px solid', borderColor: bonusPct > 0 ? '#d29d5c' : 'rgba(255,255,255,0.1)' }}>
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
                            <Typography variant="body1" fontWeight={700} color="white">{estimatedTokens.toLocaleString(undefined, {maximumFractionDigits:0})} EBONDS</Typography>
                        </Stack>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>VESTING PARAMETERS</Typography>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}><Typography variant="body2" color="white">Schedule</Typography><Typography variant="body2" fontWeight={600} color="primary.main">90-Day Linear</Typography></Stack>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Unlock Type</Typography><Typography variant="body2" color="text.secondary">Continuous</Typography></Stack>
                        </Box>
                    </Stack>
                </Box>

                {!isApproved ? (
                    <Button fullWidth variant="outlined" onClick={handleApprove} disabled={loading || !account} sx={{ py: 2, borderColor: '#d29d5c', color: '#d29d5c', fontWeight: 700 }}>{loading ? 'Approving...' : '1. Approve USDC'}</Button>
                ) : (
                    <Button fullWidth variant="contained" onClick={handleBuy} disabled={loading || !amount} sx={{ py: 2, fontWeight: 700, background: 'linear-gradient(45deg, #d29d5c, #e3b578)' }}>{loading ? 'Processing...' : '2. Confirm Allocation'}</Button>
                )}
            </Paper>
        </Box>
    );
};

export default PresaleCard;