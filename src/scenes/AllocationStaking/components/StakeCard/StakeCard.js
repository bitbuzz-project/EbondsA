import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    Box, Paper, Typography, Button, TextField, InputAdornment, Stack, Chip, CircularProgress 
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { tokenContractAddress, abi as tokenAbi } from './services/consts';
import { stakingContractAddress, abi as stakingAbi } from '../../services/consts';

// HARDCODED CONSTANT
const FIXED_DECIMALS = 18;

const StakeCard = ({ update }) => {
    const [amount, setAmount] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [isStaking, setIsStaking] = useState(false);
    const [allowance, setAllowance] = useState(0);

    const { account, library } = useWeb3React();
    const balanceWei = useSelector(state => state.userWallet.balance);

    const formatBalance = (wei) => {
        if (!wei) return '0.00';
        return parseFloat(ethers.utils.formatUnits(wei.toString(), FIXED_DECIMALS)).toFixed(2);
    };

    const handlePercent = (percent) => {
        if (!balanceWei) return;
        const total = parseFloat(ethers.utils.formatUnits(balanceWei.toString(), FIXED_DECIMALS));
        setAmount((total * percent).toFixed(4));
    };

    const getTokenContract = () => {
        const signer = library.getSigner();
        return new ethers.Contract(tokenContractAddress, tokenAbi, signer);
    };

    const getStakingContract = () => {
        const signer = library.getSigner();
        return new ethers.Contract(stakingContractAddress, stakingAbi, signer);
    };

    useEffect(() => {
        if (account && library) checkAllowance();
    }, [account, library]);

    const checkAllowance = async () => {
        try {
            const contract = getTokenContract();
            const res = await contract.allowance(account, stakingContractAddress);
            setAllowance(parseFloat(ethers.utils.formatUnits(res, FIXED_DECIMALS)));
        } catch (error) { console.error("Allowance error", error); }
    };

    const onApprove = async () => {
        setIsApproving(true);
        try {
            const contract = getTokenContract();
            const tx = await contract.approve(stakingContractAddress, ethers.constants.MaxUint256);
            await tx.wait();
            toast.success("Approval Successful!");
            checkAllowance();
        } catch (error) { toast.error("Approval Failed"); }
        setIsApproving(false);
    };

    const onStake = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setIsStaking(true);
        try {
            const contract = getStakingContract();
            
            // FIX: Use FIXED_DECIMALS to parse input
            const cleanAmount = amount.toString();
            const weiAmount = ethers.utils.parseUnits(cleanAmount, FIXED_DECIMALS);
            
            const tx = await contract.deposit(weiAmount);
            await tx.wait();
            
            toast.success("Staking Successful!");
            setAmount('');
            if (update) update();
        } catch (error) { 
            console.error(error);
            toast.error("Staking Failed: " + (error.message || "Unknown error")); 
        }
        setIsStaking(false);
    };

    const needsApproval = allowance < parseFloat(amount || 0);

    return (
        <Paper sx={{ p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={700}>Stake EBONDS</Typography>
                <Chip 
                    icon={<AccountBalanceWalletIcon sx={{ fontSize: '1rem !important' }} />} 
                    label={`${formatBalance(balanceWei)} Available`} 
                    variant="outlined" 
                    size="small" 
                    sx={{ borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}
                />
            </Box>

            <Box sx={{ position: 'relative', mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    variant="outlined"
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Typography fontWeight={700}>EBONDS</Typography></InputAdornment>,
                        sx: { 
                            bgcolor: 'rgba(0,0,0,0.2)', 
                            fontSize: '1.5rem', 
                            fontWeight: 600,
                            fontFamily: '"Space Grotesk", sans-serif',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1) !important' },
                            '&.Mui-focused fieldset': { borderColor: '#d29d5c !important' } 
                        }
                    }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
                    {[0.25, 0.50, 0.75, 1].map((pct) => (
                        <Button 
                            key={pct}
                            variant="text" 
                            size="small" 
                            onClick={() => handlePercent(pct)}
                            sx={{ 
                                minWidth: 40, 
                                p: 0.5, 
                                color: 'text.secondary',
                                bgcolor: 'rgba(255,255,255,0.02)',
                                '&:hover': { color: 'primary.main', bgcolor: 'rgba(210, 157, 92, 0.1)' } 
                            }}
                        >
                            {pct * 100}%
                        </Button>
                    ))}
                </Stack>
            </Box>

            <Box>
                {needsApproval ? (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isApproving || !account}
                        onClick={onApprove}
                        sx={{ py: 2, fontSize: '1.1rem' }}
                    >
                        {isApproving ? <CircularProgress size={24} color="inherit"/> : 'Approve Contract'}
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isStaking || !amount || parseFloat(amount) <= 0}
                        onClick={onStake}
                        startIcon={!isStaking && <ArrowDownwardIcon />}
                        sx={{ py: 2, fontSize: '1.1rem' }}
                    >
                        {isStaking ? <CircularProgress size={24} color="inherit"/> : 'Confirm Deposit'}
                    </Button>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                    Note: Staking requires a one-time approval transaction.
                </Typography>
            </Box>
        </Paper>
    );
};

export default StakeCard;