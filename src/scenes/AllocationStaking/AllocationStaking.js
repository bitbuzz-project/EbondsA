import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux'; 
import { ethers } from 'ethers';
import { Box, Grid, Typography, Paper, Skeleton, Button, Stack, Container, Divider } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RefreshIcon from '@mui/icons-material/Refresh';
import InsightsIcon from '@mui/icons-material/Insights';
import GetAppIcon from '@mui/icons-material/GetApp'; // Used for Claim button
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connector';

// Components
import StakeCard from './components/StakeCard/StakeCard';
import WithdrawCard from './components/WithdrawCard/WithdrawCard';

// Services & Store
import { abi, stakingContractAddress } from './services/consts';
import { RpcProvider } from '../../consts/rpc';
import { setBalance as setStakeBalance } from '../../features/stakingSlice'; 
import { fetchUSDTPrice, fetchEbPrice } from '../../services/prices';

// --- CONSTANTS ---
const FIXED_DECIMALS = 18; 

// Optimized Compact Stat Component
const CockpitStat = ({ label, value, highlight = false, icon, compact = false }) => (
    <Box sx={{ 
        p: compact ? 2 : 3, 
        border: '1px solid',
        borderColor: highlight ? 'primary.main' : 'rgba(255,255,255,0.1)',
        bgcolor: highlight ? 'rgba(210, 157, 92, 0.05)' : 'rgba(0,0,0,0.2)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 2 
    }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            {icon && <Box sx={{ color: highlight ? 'primary.main' : 'text.secondary', display: 'flex' }}>{icon}</Box>}
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.65rem' }}>
                {label}
            </Typography>
        </Stack>
        <Typography variant={compact ? "h5" : "h4"} fontWeight={700} sx={{ color: highlight ? 'primary.main' : 'text.primary' }}>
            {value}
        </Typography>
    </Box>
);

const AllocationStaking = () => {
    const { activate, account, library } = useWeb3React();
    const dispatch = useDispatch();
    
    const [stats, setStats] = useState({
        tvl: 0,
        apy: 0,
        totalDistributed: 0,
        esirPrice: 0,
        ebondPrice: 0,
        myPending: 0
    });
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false); // State for button loading

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
            const contract = new ethers.Contract(stakingContractAddress, abi, provider);

            const [esirP, ebondP] = await Promise.all([
                fetchUSDTPrice().catch(() => 0), 
                fetchEbPrice().catch(() => 0)
            ]);

            const totalDepositsRaw = await contract.totalDeposits();
            const paidOutRaw = await contract.paidOut();
            
            const totalDeposits = Math.floor(parseFloat(ethers.utils.formatUnits(totalDepositsRaw, FIXED_DECIMALS)));
            const paidOut = Math.floor(parseFloat(ethers.utils.formatUnits(paidOutRaw, FIXED_DECIMALS)));

            const safePrice = esirP > 0 ? esirP : 1;
            const apyVal = ((((1 + (safePrice / (0.865 * 1000))) ** 365) - 1) * 100);

            let pendingVal = 0;
            if (account) {
                 try {
                    const userInfo = await contract.userInfo(account);
                    dispatch(setStakeBalance(userInfo.amount.toString())); 
                    
                    // Call pending() to get reward balance
                    const pendingRaw = await contract.pending({ from: account }); 
                    pendingVal = Math.floor(parseFloat(ethers.utils.formatUnits(pendingRaw, FIXED_DECIMALS)));
                 } catch(e) { console.warn("User data fetch error", e); }
            }

            setStats({
                tvl: totalDeposits,
                totalDistributed: paidOut,
                apy: apyVal,
                esirPrice: esirP,
                ebondPrice: ebondP,
                myPending: pendingVal
            });
            setLoading(false);
        } catch (error) {
            console.error("Staking Data Error:", error);
            setLoading(false);
        }
    }, [account, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- CLAIM FUNCTION ---
    const handleClaim = async () => {
        if (!account || !library) return;
        try {
            setClaiming(true);
            const signer = library.getSigner();
            const contract = new ethers.Contract(stakingContractAddress, abi, signer);
            
            // Calling withdraw(0) triggers the internal harvest() function in your contract
            const tx = await contract.withdraw(0);
            await tx.wait();
            
            fetchData(); // Refresh data after transaction
        } catch (error) {
            console.error("Claim Transaction Error:", error);
        } finally {
            setClaiming(false);
        }
    };

    const calculateROI = () => {
        if (!stats.ebondPrice) return "0.00%";
        const roi = (stats.ebondPrice / 0.865) - 1;
        return `${(roi * 100).toFixed(2)}%`;
    };

    return (
        <Box sx={{ pb: 8, pt: { xs: 12, md: 20 } }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <Box>
                        <Typography variant="h2" gutterBottom>Staking Dashboard</Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={400}>
                            Track your yields in real-time.
                        </Typography>
                    </Box>
                    <Button 
                        startIcon={<RefreshIcon />} 
                        onClick={fetchData} 
                        variant="outlined"
                        size="small"
                        disabled={loading}
                        sx={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                        Refresh
                    </Button>
                </Box>

                <Grid container spacing={2} sx={{ mb: 6 }}>
                    <Grid item xs={6} md={2}>
                        <CockpitStat 
                            compact
                            label="ESIR APY" 
                            value={loading ? <Skeleton /> : `${stats.apy.toFixed(2)}%`}
                            highlight={true} 
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <CockpitStat 
                            compact
                            label="EBONDS ROI" 
                            value={loading ? <Skeleton /> : calculateROI()}
                            highlight={true}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CockpitStat 
                            label="Total Value Locked" 
                            value={loading ? <Skeleton /> : `${stats.tvl.toLocaleString()} EBONDS`} 
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CockpitStat 
                            label="Total Rewards Paid" 
                            value={loading ? <Skeleton /> : `${stats.totalDistributed.toLocaleString()} ESIR`} 
                        />
                    </Grid>
                </Grid>

                <Box sx={{ position: 'relative' }}>
                    {!account && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            zIndex: 10,
                            backdropFilter: 'blur(8px)',
                            bgcolor: 'rgba(10, 16, 25, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <AccountBalanceWalletIcon sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
                            <Typography variant="h5" fontWeight={700} gutterBottom>Wallet Not Connected</Typography>
                            <Button variant="contained" onClick={() => activate(injected)}>Connect Wallet</Button>
                        </Box>
                    )}

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 4, height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>My Rewards</Typography>
                                    <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="body2" color="text.secondary">CLAIMABLE ESIR</Typography>
                                        <Typography variant="h3" color="primary.main" fontWeight={700}>
                                            {loading ? <Skeleton /> : stats.myPending.toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ≈ ${(stats.myPending * stats.esirPrice).toFixed(2)} USD
                                        </Typography>
                                    </Box>

                                    {/* --- CLAIM BUTTON --- */}
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        startIcon={<GetAppIcon />}
                                        onClick={handleClaim}
                                        disabled={claiming || stats.myPending <= 0}
                                        sx={{ py: 1.5, fontWeight: 700 }}
                                    >
                                        {claiming ? 'Processing...' : 'Claim ESIR Rewards'}
                                    </Button>
                                </Box>
                                <Box sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Note: Claiming rewards will harvest your ESIR tokens to your wallet while keeping your EBONDS staked.
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Stack spacing={4}>
                                <StakeCard update={fetchData} />
                                <WithdrawCard update={fetchData} />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container> 
        </Box>
    );
};

export default AllocationStaking;