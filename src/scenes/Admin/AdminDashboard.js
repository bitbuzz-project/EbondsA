import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { SALE_ABI, SALE_ADDRESS } from '../../consts/abi';
import { 
    Box, Grid, Paper, Typography, CircularProgress, LinearProgress, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Button, Divider, Tabs, Tab 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { toast } from 'react-toastify';

// Import the Control Panel component we discussed
import AdminControlPanel from './AdminControlPanel'; 

const AdminDashboard = () => {
    const { library, account } = useWeb3React();
    const [activeTab, setActiveTab] = useState(0); // 0: Dashboard, 1: Controls
    const [loading, setLoading] = useState(true);
    const [searchAddr, setSearchAddr] = useState('');
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState({
        raised: 0, sold: 0, participants: 0, unclaimed: 0,
        minPurchase: 0, price: 0, isPaused: false, tiers: []
    });

    const HARDCAP = 1000000; // $1M USDC

    const fetchGlobalStats = async () => {
        try {
            const provider = library || new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
            const contract = new ethers.Contract(SALE_ADDRESS, SALE_ABI, provider);

            const [raised, sold, count, unclaimed, min, priceNum, paused, tiers] = await Promise.all([
                contract.totalUsdcRaised(),
                contract.totalEbondsSold(),
                contract.getParticipantCount(),
                contract.getTotalUnclaimedTokens(), // ✅ Fixed: correct function name
                contract.minimumPurchaseUSDC(),
                contract.priceNumerator(),
                contract.paused(),
                contract.getBonusTiers()
            ]);

            setStats({
                raised: parseFloat(ethers.utils.formatUnits(raised, 6)),
                sold: ethers.utils.formatUnits(sold, 18),
                participants: count.toNumber(),
                unclaimed: ethers.utils.formatUnits(unclaimed, 18),
                minPurchase: ethers.utils.formatUnits(min, 6),
                price: priceNum.toNumber() / 1000,
                isPaused: paused,
                tiers: tiers
            });
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const handleSearchUser = async () => {
        if (!ethers.utils.isAddress(searchAddr)) return toast.error("Invalid Address");
        try {
            const provider = library || new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
            const contract = new ethers.Contract(SALE_ADDRESS, SALE_ABI, provider);
            
            // ✅ FIXED: Updated to match contract's return structure
            const info = await contract.getVestingInfo(searchAddr);
            
            // Contract returns: (claimableAmount, vestingAmount, vestedFromSchedule, totalClaimable, totalClaimed, vestingStartTime, vestingEndTime)
            const totalPurchased = parseFloat(ethers.utils.formatUnits(info.claimableAmount, 18)) + 
                                   parseFloat(ethers.utils.formatUnits(info.vestingAmount, 18));
            
            const vestingDuration = info.vestingEndTime.toNumber() - info.vestingStartTime.toNumber();
            const elapsed = Math.min(Date.now() / 1000 - info.vestingStartTime.toNumber(), vestingDuration);
            const progressPercent = vestingDuration > 0 ? Math.min((elapsed / vestingDuration) * 100, 100) : 0;
            
            setUserData({
                purchased: totalPurchased.toFixed(2),
                claimed: ethers.utils.formatUnits(info.totalClaimed, 18),
                claimable: ethers.utils.formatUnits(info.totalClaimable, 18),
                progress: Math.round(progressPercent),
                end: info.vestingEndTime.toNumber() > 0 
                    ? new Date(info.vestingEndTime.toNumber() * 1000).toLocaleDateString() 
                    : 'N/A'
            });
        } catch (e) { 
            console.error(e);
            toast.error("User not found or no vesting schedule"); 
        }
    };

    useEffect(() => { 
        fetchGlobalStats(); 
        const interval = setInterval(fetchGlobalStats, 20000);
        return () => clearInterval(interval);
    }, [library]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, mt: 12, color: 'white', maxWidth: '1400px', mx: 'auto' }}>
            {/* Navigation Tabs */}
            <Paper sx={{ bgcolor: '#0a1019', mb: 4, borderBottom: '1px solid rgba(210, 157, 92, 0.3)' }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, v) => setActiveTab(v)} 
                    centered
                    sx={{
                        '& .MuiTabs-indicator': { bgcolor: '#d29d5c' },
                        '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' },
                        '& .Mui-selected': { color: '#d29d5c !important' }
                    }}
                >
                    <Tab icon={<DashboardIcon />} iconPosition="start" label="SALE ANALYTICS" />
                    <Tab icon={<SettingsIcon />} iconPosition="start" label="CONTROL PANEL" />
                </Tabs>
            </Paper>

            {activeTab === 0 ? (
                <Grid container spacing={3}>
                    {/* --- ANALYTICS VIEW --- */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, bgcolor: '#0a1019', border: '1px solid #d29d5c', mb: 3 }}>
                            <Typography variant="h6" color="#d29d5c">Hardcap Progress (${(HARDCAP/1e6)}M Target)</Typography>
                            <LinearProgress variant="determinate" value={(stats.raised / HARDCAP) * 100} sx={{ my: 2, height: 12, borderRadius: 5, bgcolor: '#1a212b', '& .MuiLinearProgress-bar': { bgcolor: '#d29d5c' } }} />
                            <Grid container spacing={2}>
                                <Grid item xs={4}><Typography variant="caption" sx={{opacity: 0.7}}>Total Raised</Typography><Typography variant="h5">${stats.raised.toLocaleString()}</Typography></Grid>
                                <Grid item xs={4}><Typography variant="caption" sx={{opacity: 0.7}}>Tokens Sold</Typography><Typography variant="h5">{parseFloat(stats.sold).toLocaleString()} EBONDS</Typography></Grid>
                                <Grid item xs={4}><Typography variant="caption" sx={{opacity: 0.7}}>Active Obligations</Typography><Typography variant="h5">{parseFloat(stats.unclaimed).toLocaleString()}</Typography></Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 3, bgcolor: '#0a1019', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Typography variant="h6" gutterBottom>Investor Vesting Lookup</Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <TextField fullWidth size="small" placeholder="Enter Wallet Address" value={searchAddr} onChange={(e) => setSearchAddr(e.target.value)} sx={{ input: { color: 'white' }, bgcolor: 'rgba(255,255,255,0.05)' }} />
                                <Button variant="contained" onClick={handleSearchUser} sx={{ bgcolor: '#d29d5c', color: 'black', '&:hover': { bgcolor: '#b88a4d' } }}>Search</Button>
                            </Box>
                            {userData && (
                                <Box sx={{ bgcolor: 'rgba(210, 157, 92, 0.05)', p: 2, borderRadius: 1, border: '1px dashed #d29d5c' }}>
                                    <Typography variant="subtitle2" color="#d29d5c">Vesting Schedule Found:</Typography>
                                    <Typography variant="body2">Purchased: <b>{userData.purchased}</b> | Claimed: <b>{userData.claimed}</b></Typography>
                                    <Typography variant="body2">Claimable Now: <b style={{color: '#4caf50'}}>{userData.claimable} EBONDS</b></Typography>
                                    <Typography variant="body2">Unlock Completion: {userData.end}</Typography>
                                    <LinearProgress variant="determinate" value={userData.progress} sx={{ mt: 1.5, height: 6 }} />
                                    <Typography variant="caption">{userData.progress}% Vested</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, bgcolor: '#0a1019', border: '1px solid #d29d5c', mb: 3 }}>
                            <Typography variant="h6">Live Parameters</Typography>
                            <Divider sx={{ my: 1.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="body2">Current Price:</Typography><Typography variant="body2"><b>${stats.price}</b></Typography></Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="body2">Min Purchase:</Typography><Typography variant="body2"><b>${stats.minPurchase} USDC</b></Typography></Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Status:</Typography><Typography variant="body2" color={stats.isPaused ? "error" : "success.main"}><b>{stats.isPaused ? "PAUSED" : "ACTIVE"}</b></Typography></Box>
                        </Paper>

                        <TableContainer component={Paper} sx={{ bgcolor: '#0a1019', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Table size="small">
                                <TableHead><TableRow><TableCell sx={{ color: '#d29d5c', fontWeight: 'bold' }}>Tier Threshold</TableCell><TableCell sx={{ color: '#d29d5c', fontWeight: 'bold' }}>Bonus</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {stats.tiers.map((t, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ color: 'white' }}>${(t.threshold / 1e6).toLocaleString()}</TableCell>
                                            <TableCell sx={{ color: 'white' }}>{t.bonusPercent / 100}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            ) : (
                /* --- CONTROL PANEL VIEW --- */
                <AdminControlPanel />
            )}
        </Box>
    );
};

export default AdminDashboard;