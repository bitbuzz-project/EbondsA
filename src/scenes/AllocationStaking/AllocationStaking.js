import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { Box, Grid, Typography, Paper, Skeleton } from '@mui/material';
import { toast } from 'react-toastify';

// Components
import StakeCard from './components/StakeCard/StakeCard';
import WithdrawCard from './components/WithdrawCard/WithdrawCard';

// Services & Store
import { abi, stakingContractAddress } from './services/consts';
import { RpcProvider } from '../../consts/rpc';
// --- FIXED IMPORT BELOW ---
import { setBalance as setStakeBalance } from '../../features/stakingSlice'; 
import { fetchUSDTPrice, fetchEbPrice } from '../../services/prices';

// Simple Stat Component
const HeaderStat = ({ label, value, subtext }) => (
    <Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
            {label}
        </Typography>
        <Typography variant="h4" fontWeight={800} color="text.primary">
            {value}
        </Typography>
        {subtext && <Typography variant="caption" color="success.main">{subtext}</Typography>}
    </Box>
);

const AllocationStaking = () => {
    const dispatch = useDispatch();
    const address = useSelector(state => state.userWallet.address);
    const decimals = useSelector(state => state.userWallet.decimal);

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

    const fetchData = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
            const contract = new ethers.Contract(stakingContractAddress, abi, provider);

            // 1. Fetch Prices
            const esirP = await fetchUSDTPrice();
            const ebondP = await fetchEbPrice();

            // 2. Fetch Contract Stats
            const totalDepositsRaw = await contract.totalDeposits();
            const paidOutRaw = await contract.paidOut();
            
            const totalDeposits = parseFloat(ethers.utils.formatUnits(totalDepositsRaw, decimals));
            const paidOut = parseFloat(ethers.utils.formatUnits(paidOutRaw, decimals));

            // 3. APY Calculation
            const apyVal = ((((1 + (esirP / (0.865 * 1000))) ** 365) - 1) * 100);

            // 4. User Specific Data
            let pendingVal = 0;
            if (address) {
                 const userInfo = await contract.userInfo(address);
                 dispatch(setStakeBalance(parseInt(userInfo.amount.toString()))); // Update Redux

                 // Try fetching pending
                 try {
                    const pendingRaw = await contract.pending(address); 
                    pendingVal = parseFloat(ethers.utils.formatUnits(pendingRaw, decimals));
                 } catch(e) { console.warn("Pending fetch error", e); }
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
            console.error("Staking Page Error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Live update
        return () => clearInterval(interval);
    }, [address, decimals]);

    return (
        <Box sx={{ pb: 8 }}>
            
            {/* 1. Header & Stats Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h2" fontWeight={800} gutterBottom>
                    Earn ESIR
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mb: 4 }}>
                    Stake your EBONDS to earn 20% guaranteed APY plus ESIR rewards. 
                    Unlock higher allocations for upcoming IDOs.
                </Typography>

                {/* Stats Row */}
                <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Grid container spacing={4} divider={<Box sx={{ borderRight: '1px solid rgba(0,0,0,0.1)', height: 50, my: 'auto', display: { xs: 'none', md: 'block' } }} />}>
                        <Grid item xs={12} md={3}>
                            <HeaderStat 
                                label="Annual Yield (APY)" 
                                value={loading ? <Skeleton width={100} /> : `${stats.apy.toFixed(2)}%`} 
                                subtext="Fixed Rate"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <HeaderStat 
                                label="Total Value Locked" 
                                value={loading ? <Skeleton width={100} /> : `${stats.tvl.toLocaleString()} EBONDS`} 
                                subtext={`$${(stats.tvl * stats.ebondPrice).toLocaleString()} USD`}
                            />
                        </Grid>
                         <Grid item xs={12} md={3}>
                            <HeaderStat 
                                label="Rewards Distributed" 
                                value={loading ? <Skeleton width={100} /> : `${stats.totalDistributed.toLocaleString()}`} 
                                subtext="Total ESIR Paid"
                            />
                        </Grid>
                         <Grid item xs={12} md={3}>
                            <HeaderStat 
                                label="My Pending Rewards" 
                                value={loading ? <Skeleton width={100} /> : `${stats.myPending.toFixed(4)}`} 
                                subtext="ESIR Available"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* 2. Interaction Cards */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <StakeCard update={fetchData} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <WithdrawCard update={fetchData} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AllocationStaking;