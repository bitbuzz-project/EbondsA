import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { 
  Box, Card, CardContent, Typography, TextField, Button, InputAdornment, Stack, Chip, Divider, LinearProgress
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RedeemedIcon from '@mui/icons-material/Redeem';

import { abi, stakingContractAddress } from './../../services/consts';
import { RpcProvider } from '../../../../consts/rpc';

const WithdrawCard = ({ update }) => {
    const [amount, setAmount] = useState('');
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);
    const [loadingClaim, setLoadingClaim] = useState(false);
    
    const [stakingInfo, setStakingInfo] = useState({
        deposited: 0,
        stakingStart: 0,
        pendingRewards: 0
    });

    const walletAddress = useSelector(state => state.userWallet.address);
    const decimals = useSelector(state => state.userWallet.decimal);

    // --- Fetch User Data ---
    useEffect(() => {
        if (!walletAddress) return;

        const getData = async () => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
                const contract = new ethers.Contract(stakingContractAddress, abi, provider);
                
                const userInfo = await contract.userInfo(walletAddress);
                const stakedAmount = parseFloat(ethers.utils.formatUnits(userInfo.amount, decimals));
                const startTime = parseInt(userInfo.stakingStart.toString());

                // Calculate Pending Rewards locally for UI (Approximation based on contract logic)
                // Formula: amount * duration * 36.5% / 100
                let pendingVal = 0;
                if (stakedAmount > 0 && startTime > 0) {
                    const timeElapsed = (Date.now() / 1000) - startTime;
                    const secondsPerYear = 31556926;
                    // 3650 basis points = 36.5%
                    pendingVal = (stakedAmount * timeElapsed * 36.5) / 100 / secondsPerYear; 
                }

                setStakingInfo({
                    deposited: stakedAmount,
                    stakingStart: startTime,
                    pendingRewards: pendingVal
                });

            } catch (error) {
                console.error("Withdraw Data Error:", error);
            }
        };
        getData();
        // Refresh every 15s
        const interval = setInterval(getData, 15000);
        return () => clearInterval(interval);
    }, [walletAddress, decimals, update]);

    // --- Actions ---

    const handleUnstake = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error("Enter a valid amount to unstake");
            return;
        }
        setLoadingWithdraw(true);
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(stakingContractAddress, abi, signer);

            const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);
            const tx = await contract.withdraw(amountWei);
            
            await toast.promise(tx.wait(), {
                pending: 'Unstaking EBONDS...',
                success: 'Unstaked successfully!',
                error: 'Unstake failed'
            });
            
            setAmount('');
            if (update) update();
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || "Transaction failed");
        } finally {
            setLoadingWithdraw(false);
        }
    };

    const handleClaim = async () => {
        setLoadingClaim(true);
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(stakingContractAddress, abi, signer);

            // Withdraw 0 triggers harvest() in your contract
            const tx = await contract.withdraw(0); 
            
            await toast.promise(tx.wait(), {
                pending: 'Claiming Rewards...',
                success: 'Rewards Claimed!',
                error: 'Claim failed'
            });
            
            if (update) update();
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || "Transaction failed");
        } finally {
            setLoadingClaim(false);
        }
    };

    const daysStaked = stakingInfo.stakingStart > 0 
        ? Math.floor((Date.now() / 1000 - stakingInfo.stakingStart) / 86400) 
        : 0;

    return (
        <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Withdraw & Claim
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Unstake your EBONDS or claim your ESIR rewards.
                </Typography>

                {/* Stats Box */}
                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary">Staked Balance</Typography>
                        <Typography variant="body2" fontWeight={700}>{stakingInfo.deposited.toLocaleString()} EBONDS</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary">Pending Rewards</Typography>
                        <Typography variant="body2" fontWeight={700} color="success.main">
                            {stakingInfo.pendingRewards.toFixed(4)} ESIR
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">Time Staked</Typography>
                        <Chip 
                            icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} 
                            label={`${daysStaked} Days`} 
                            size="small" 
                            color={daysStaked < 14 ? "warning" : "success"} 
                            variant="outlined" 
                        />
                    </Stack>
                </Box>

                {/* Unstake Input */}
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Unstake Amount</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button 
                                    onClick={() => setAmount(stakingInfo.deposited)}
                                    size="small"
                                    sx={{ fontWeight: 700 }}
                                >
                                    MAX
                                </Button>
                            </InputAdornment>
                        )
                    }}
                    sx={{ mb: 2 }}
                />

                {/* Action Buttons */}
                <Stack spacing={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        size="large"
                        disabled={!walletAddress || loadingWithdraw || stakingInfo.deposited <= 0}
                        onClick={handleUnstake}
                        sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
                    >
                        {loadingWithdraw ? 'Processing...' : 'Unstake EBONDS'}
                    </Button>

                    <Divider>OR</Divider>

                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={<RedeemedIcon />}
                        disabled={!walletAddress || loadingClaim}
                        onClick={handleClaim}
                        sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
                    >
                        {loadingClaim ? 'Processing...' : 'Claim Rewards Only'}
                    </Button>
                </Stack>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center', opacity: 0.7 }}>
                    *Claiming rewards resets your staking timer.
                </Typography>

            </CardContent>
        </Card>
    );
}

export default WithdrawCard;