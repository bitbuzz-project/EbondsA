import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux'; 
import { ethers } from 'ethers';
import { Box, Grid, Typography, Paper, Skeleton, Button, Chip, Divider, Stack, Container } from '@mui/material'; // Added Container
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RefreshIcon from '@mui/icons-material/Refresh';
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

const CockpitStat = ({ label, value, subtext, highlight = false }) => (
    <Box sx={{ 
        p: 3, 
        border: '1px solid',
        borderColor: highlight ? 'primary.main' : 'rgba(255,255,255,0.1)',
        bgcolor: highlight ? 'rgba(210, 157, 92, 0.05)' : 'rgba(0,0,0,0.2)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 2 // Added border radius
    }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1, fontWeight: 700 }}>
            {label}
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ color: highlight ? 'primary.main' : 'text.primary' }}>
            {value}
        </Typography>
        {subtext && (
            <Typography variant="caption" sx={{ color: 'success.main', mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {subtext}
            </Typography>
        )}
    </Box>
);

const AllocationStaking = () => {
    const { activate, account } = useWeb3React();
    const dispatch = useDispatch();
    
    // State
    const [stats, setStats] = useState({
        tvl: 0,
        apy: 0,
        totalDistributed: 0,
        esirPrice: 0,
        ebondPrice: 0,
        myPending: 0
    });
    const [loading, setLoading] = useState(true);

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
            
            const totalDeposits = parseFloat(ethers.utils.formatUnits(totalDepositsRaw, FIXED_DECIMALS));
            const paidOut = parseFloat(ethers.utils.formatUnits(paidOutRaw, FIXED_DECIMALS));

            const safePrice = esirP > 0 ? esirP : 1;
            const apyVal = ((((1 + (safePrice / (0.865 * 1000))) ** 365) - 1) * 100);

            let pendingVal = 0;
            if (account) {
                 try {
                    const userInfo = await contract.userInfo(account);
                    dispatch(setStakeBalance(userInfo.amount.toString())); 

                    const pendingRaw = await contract.pending(account); 
                    pendingVal = parseFloat(ethers.utils.formatUnits(pendingRaw, FIXED_DECIMALS));
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

    return (
        <Box sx={{ pb: 8, pt: { xs: 12, md: 20 } }}>
            {/* FIX: Added Container to control width and margins */}
            <Container maxWidth="xl">
                
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <Box>
                        <Typography variant="h2" gutterBottom>
                            Staking Dashboard
                        </Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={400}>
                            Manage your positions and track yields in real-time.
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

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={4}>
                        <CockpitStat 
                            label="Current APY" 
                            value={loading ? <Skeleton width={100} /> : `${stats.apy.toFixed(2)}%`}
                            highlight={true} 
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CockpitStat 
                            label="Total Value Locked" 
                            value={loading ? <Skeleton width={120} /> : `${stats.tvl.toLocaleString()} EBONDS`} 
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CockpitStat 
                            label="Total Rewards Paid" 
                            value={loading ? <Skeleton width={120} /> : `${stats.totalDistributed.toLocaleString()} ESIR`} 
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
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Wallet Not Connected
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Please connect your wallet to view your positions.
                            </Typography>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={() => activate(injected)}
                                sx={{ px: 4, py: 1.5 }}
                            >
                                Connect Wallet
                            </Button>
                        </Box>
                    )}

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2 }}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>My Rewards</Typography>
                                    <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                                    
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>PENDING ESIR</Typography>
                                        <Typography variant="h3" color="primary.main" fontWeight={700}>
                                            {loading ? <Skeleton /> : stats.myPending.toFixed(4)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ≈ ${(stats.myPending * stats.esirPrice).toFixed(2)} USD
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Rewards are calculated per block. You can claim at any time.
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
            </Container> {/* Container Ends Here */}
        </Box>
    );
};

export default AllocationStaking;