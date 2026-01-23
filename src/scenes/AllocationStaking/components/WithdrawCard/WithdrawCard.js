import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    Box, Paper, Typography, Button, TextField, InputAdornment, Stack, Chip, CircularProgress 
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LogoutIcon from '@mui/icons-material/Logout';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { stakingContractAddress, abi as stakingAbi } from '../../services/consts';

// HARDCODED CONSTANT
const FIXED_DECIMALS = 18;

const WithdrawCard = ({ update }) => {
    const [amount, setAmount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const { library } = useWeb3React();
    
    // REDUX: This is now a STRING (Wei)
    const stakedBalanceWei = useSelector(state => state.staking.balance); 

    const formattedBalance = stakedBalanceWei 
        ? ethers.utils.formatUnits(stakedBalanceWei, FIXED_DECIMALS) 
        : '0';

    const handlePercent = (percent) => {
        if (!stakedBalanceWei || stakedBalanceWei === '0') return;
        const total = parseFloat(formattedBalance);
        setAmount((total * percent).toFixed(4));
    };

    const onWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setIsWithdrawing(true);
        try {
            const signer = library.getSigner();
            const contract = new ethers.Contract(stakingContractAddress, stakingAbi, signer);
            
            // Convert Input (Standard) to Wei using FIXED_DECIMALS
            const weiAmount = ethers.utils.parseUnits(amount.toString(), FIXED_DECIMALS);
            
            const tx = await contract.withdraw(weiAmount);
            await tx.wait();
            
            toast.success("Withdrawal Successful!");
            setAmount('');
            if (update) update();
        } catch (error) {
            console.error(error);
            toast.error("Withdrawal Failed");
        }
        setIsWithdrawing(false);
    };

    return (
        <Paper sx={{ 
            p: 4, 
            height: '100%', 
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: parseFloat(formattedBalance) > 0 ? 1 : 0.8
        }}>
             <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={700}>Unstake</Typography>
                <Chip 
                    icon={<AccountBalanceIcon sx={{ fontSize: '1rem !important' }} />} 
                    label={`${parseFloat(formattedBalance).toFixed(2)} Staked`} 
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

             <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                disabled={isWithdrawing || !amount || parseFloat(amount) <= 0}
                onClick={onWithdraw}
                startIcon={!isWithdrawing && <LogoutIcon />}
                sx={{ py: 2, fontSize: '1.1rem', borderWidth: '2px !important' }}
            >
                {isWithdrawing ? <CircularProgress size={24} color="inherit"/> : 'Unstake & Claim'}
            </Button>
        </Paper>
    );
};

export default WithdrawCard;