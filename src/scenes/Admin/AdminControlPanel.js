import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { SALE_ABI, SALE_ADDRESS, TOKEN_ABI } from '../../consts/abi';
import { 
    Box, Button, TextField, Typography, Paper, Grid, 
    Switch, FormControlLabel, Divider, Stack 
} from '@mui/material';
import { toast } from 'react-toastify';

const AdminControlPanel = () => {
    const { library, account } = useWeb3React();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [contractUsdcBalance, setContractUsdcBalance] = useState('0');
    const [contractEbondsBalance, setContractEbondsBalance] = useState('0');
    
    const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; 
    const EBONDS_ADDRESS = "0x53Ee546eB38fB2C8b870f56DeeaeCF80367a4551";
    
    // Form States
    const [price, setPrice] = useState('');
    const [minPurchase, setMinPurchase] = useState('');
    const [tierThreshold, setTierThreshold] = useState('');
    const [tierBonus, setTierBonus] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('0');
    
    // ✅ NEW: Emergency withdraw states
    const [emergencyTokenAddress, setEmergencyTokenAddress] = useState('');
    const [emergencyAmount, setEmergencyAmount] = useState('');

    const fetchTreasuryBalances = async () => {
        if (!library) return;
        try {
            const provider = library;
            const usdcContract = new ethers.Contract(USDC_ADDRESS, TOKEN_ABI, provider);
            const ebondsContract = new ethers.Contract(EBONDS_ADDRESS, TOKEN_ABI, provider);

            const [usdcBal, ebondsBal] = await Promise.all([
                usdcContract.balanceOf(SALE_ADDRESS),
                ebondsContract.balanceOf(SALE_ADDRESS)
            ]);

            setContractUsdcBalance(ethers.utils.formatUnits(usdcBal, 6));
            setContractEbondsBalance(ethers.utils.formatUnits(ebondsBal, 18));
        } catch (error) {
            console.error("Error fetching treasury balances:", error);
        }
    };

    useEffect(() => {
        fetchTreasuryBalances();
        // Refresh every 30 seconds
        const interval = setInterval(fetchTreasuryBalances, 30000);
        return () => clearInterval(interval);
    }, [library]);
    
    const EXCLUSIVE_VIEWER = "0x0d9C0C5B544eed0367D88aAc5Cf7671ba3946c6E";

    useEffect(() => {
        const checkAuth = async () => {
            if (!library || !account) return;
            if (account.toLowerCase() === EXCLUSIVE_VIEWER.toLowerCase()) {
                setIsAdmin(true);
            } else {
                const contract = new ethers.Contract(SALE_ADDRESS, SALE_ABI, library);
                const owner = await contract.owner();
                setIsAdmin(owner.toLowerCase() === account.toLowerCase());
            }
            const contract = new ethers.Contract(SALE_ADDRESS, SALE_ABI, library);
            setIsPaused(await contract.paused());
        };
        checkAuth();
    }, [library, account]);

    const getContract = () => new ethers.Contract(SALE_ADDRESS, SALE_ABI, library.getSigner());

    // --- EDIT FUNCTIONS ---

    const togglePause = async () => {
        try {
            const tx = isPaused ? await getContract().unpause() : await getContract().pause();
            await tx.wait();
            setIsPaused(!isPaused);
            toast.success("Sale status updated");
        } catch (e) { 
            console.error(e);
            toast.error("Transaction failed"); 
        }
    };

    const updatePrice = async () => {
        try {
            const val = Math.round(parseFloat(price) * 1000);
            const tx = await getContract().setPrice(val);
            await tx.wait();
            toast.success("Price updated");
        } catch (e) { 
            console.error(e);
            toast.error("Check price limits ($0.10 - $10)"); 
        }
    };

    const updateMinPurchase = async () => {
        try {
            const val = ethers.utils.parseUnits(minPurchase, 6);
            const tx = await getContract().setMinimumPurchase(val);
            await tx.wait();
            toast.success("Minimum purchase updated");
        } catch (e) { 
            console.error(e);
            toast.error("Update failed"); 
        }
    };

    const addTier = async () => {
        try {
            const threshold = ethers.utils.parseUnits(tierThreshold, 6);
            const bonus = Math.round(parseFloat(tierBonus) * 100);
            const tx = await getContract().addBonusTier(threshold, bonus);
            await tx.wait();
            toast.success("Bonus tier added");
        } catch (e) { 
            console.error(e);
            toast.error("Failed to add tier"); 
        }
    };

    const resetTiers = async () => {
        if(!window.confirm("Reset all bonus tiers?")) return;
        try {
            const tx = await getContract().resetBonusTiers();
            await tx.wait();
            toast.success("Tiers reset");
        } catch (e) { 
            console.error(e);
            toast.error("Reset failed"); 
        }
    };

    const handleWithdraw = async (type) => {
        try {
            const amount = ethers.utils.parseUnits(withdrawAmount, type === 'USDC' ? 6 : 18);
            const tx = type === 'USDC' 
                ? await getContract().withdrawUSDC(amount)
                : await getContract().withdrawExcessEbonds(amount);
            await tx.wait();
            toast.success(`${type} Withdrawal successful`);
            fetchTreasuryBalances(); // Refresh balances
        } catch (e) { 
            console.error(e);
            toast.error("Withdrawal failed: Check excess liquidity"); 
        }
    };

    // ✅ FIXED: Emergency withdraw with proper token address input
    const handleEmergencyWithdraw = async () => {
        if (!ethers.utils.isAddress(emergencyTokenAddress)) {
            toast.error("Invalid token address");
            return;
        }
        
        if (!window.confirm("⚠️ EMERGENCY WITHDRAW - Are you absolutely sure? This bypasses safety checks!")) {
            return;
        }

        try {
            const decimals = emergencyTokenAddress.toLowerCase() === USDC_ADDRESS.toLowerCase() ? 6 : 18;
            const amount = emergencyAmount === '0' || emergencyAmount === '' 
                ? 0 
                : ethers.utils.parseUnits(emergencyAmount, decimals);
            
            const tx = await getContract().emergencyWithdraw(emergencyTokenAddress, amount);
            await tx.wait();
            toast.success("Emergency withdrawal successful");
            fetchTreasuryBalances(); // Refresh balances
        } catch (e) {
            console.error(e);
            toast.error("Emergency withdrawal failed");
        }
    };

    if (!isAdmin) return <Typography sx={{p:5, textAlign:'center', color:'red'}}>Access Denied</Typography>;

    return (
        <Box sx={{ animation: 'fadeIn 0.5s' }}>
            <Grid container spacing={3}>
                {/* Sale State */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, bgcolor: '#0a1019', border: '1px solid #d29d5c' }}>
                        <Typography variant="h6" gutterBottom>Sale Status</Typography>
                        <FormControlLabel
                            control={<Switch checked={!isPaused} onChange={togglePause} color="success" />}
                            label={isPaused ? "PAUSED" : "ACTIVE"}
                        />
                    </Paper>
                </Grid>

                {/* Pricing & Limits */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, bgcolor: '#0a1019', border: '1px solid #d29d5c' }}>
                        <Typography variant="h6" gutterBottom>Core Parameters</Typography>
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="Price ($)" 
                                size="small" 
                                value={price} 
                                onChange={e=>setPrice(e.target.value)} 
                                sx={{input:{color:'white'}}} 
                            />
                            <Button 
                                variant="contained" 
                                onClick={updatePrice} 
                                sx={{bgcolor:'#d29d5c', color:'black'}}
                            >
                                Update Price
                            </Button>
                            <TextField 
                                label="Min Buy (USDC)" 
                                size="small" 
                                value={minPurchase} 
                                onChange={e=>setMinPurchase(e.target.value)} 
                                sx={{input:{color:'white'}}} 
                            />
                            <Button 
                                variant="contained" 
                                onClick={updateMinPurchase} 
                                sx={{bgcolor:'#d29d5c', color:'black'}}
                            >
                                Update Min
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Bonus Management */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: '#0a1019', border: '1px solid #d29d5c' }}>
                        <Typography variant="h6" gutterBottom>Bonus Tier Management</Typography>
                        <Stack spacing={2}>
                            <TextField 
                                label="Threshold (USDC)" 
                                size="small" 
                                value={tierThreshold} 
                                onChange={e=>setTierThreshold(e.target.value)} 
                            />
                            <TextField 
                                label="Bonus (%) e.g. 10.5" 
                                size="small" 
                                value={tierBonus} 
                                onChange={e=>setTierBonus(e.target.value)} 
                            />
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    onClick={addTier} 
                                    sx={{bgcolor:'#d29d5c', color:'black'}}
                                >
                                    Add Tier
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    color="error" 
                                    onClick={resetTiers}
                                >
                                    Reset All Tiers
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Treasury */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: '#0a1019', border: '1px solid #d29d5c' }}>
                        <Typography variant="h6" gutterBottom>Treasury & Withdrawals</Typography>
                        
                        {/* Balance Display Board */}
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="caption" color="text.secondary">USDC IN CONTRACT</Typography>
                                <Typography variant="h6" color="#d29d5c" fontWeight={700}>
                                    ${parseFloat(contractUsdcBalance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="caption" color="text.secondary">EXCESS EBONDS</Typography>
                                <Typography variant="h6" color="white" fontWeight={700}>
                                    {parseFloat(contractEbondsBalance).toLocaleString(undefined, {maximumFractionDigits: 0})}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                        <TextField 
                            fullWidth 
                            label="Amount (0 = All)" 
                            size="small" 
                            value={withdrawAmount} 
                            onChange={e=>setWithdrawAmount(e.target.value)} 
                            sx={{ mb: 2, input: { color: 'white' } }} 
                        />
                        
                        <Stack direction="row" spacing={2}>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                onClick={() => handleWithdraw('USDC')}
                            >
                                Withdraw USDC
                            </Button>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                onClick={() => handleWithdraw('EBONDS')}
                            >
                                Withdraw EBONDS
                            </Button>
                        </Stack>
                        
                        {/* ✅ FIXED: Proper Emergency Withdraw Section */}
                        <Divider sx={{ my: 3, borderColor: 'rgba(255,0,0,0.2)' }} />
                        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                            ⚠️ Emergency Withdraw (Use with caution)
                        </Typography>
                        <TextField 
                            fullWidth 
                            label="Token Address" 
                            size="small" 
                            value={emergencyTokenAddress} 
                            onChange={e=>setEmergencyTokenAddress(e.target.value)}
                            placeholder="0x..."
                            sx={{ mb: 1, input: { color: 'white' } }} 
                        />
                        <TextField 
                            fullWidth 
                            label="Amount (0 = All)" 
                            size="small" 
                            value={emergencyAmount} 
                            onChange={e=>setEmergencyAmount(e.target.value)}
                            sx={{ mb: 2, input: { color: 'white' } }} 
                        />
                        <Button 
                            fullWidth 
                            color="error" 
                            variant="contained" 
                            onClick={handleEmergencyWithdraw}
                        >
                            Emergency Withdraw
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminControlPanel;