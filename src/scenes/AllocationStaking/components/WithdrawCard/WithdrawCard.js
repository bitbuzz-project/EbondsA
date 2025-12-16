import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';

import { abi, stakingContractAddress } from './../../services/consts';
import { abi as tokenAbi, tokenContractAddress } from './../StakeCard/services/consts';
import { setBalance } from './../../../../features/userWalletSlice';
import { selectAddress } from './../../../../features/userWalletSlice';

const WithdrawCard = ({ update }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Redux
    // Note: ensure your stakingSlice is providing 'balance' correctly as raw uint or formatted. 
    // Based on previous code, it seemed raw.
    const stakedRaw = useSelector(state => state.staking.balance); 
    const decimals = useSelector(state => state.userWallet.decimal);
    const walletAddress = useSelector(selectAddress);

    const stakedFormatted = stakedRaw / Math.pow(10, decimals);

    const handleAction = async (isClaimOnly = false) => {
        setLoading(true);
        try {
            const { ethereum } = window;
            if (!ethereum) throw new Error("No wallet found");

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(stakingContractAddress, abi, signer);

            let tx;
            if (isClaimOnly) {
                // Withdraw 0 to just harvest rewards
                tx = await contract.withdraw(0);
                await toast.promise(tx.wait(), {
                    pending: 'Claiming Rewards...',
                    success: 'Rewards Claimed!',
                    error: 'Claim failed'
                });
            } else {
                // Withdraw Stake
                if (!amount || parseFloat(amount) <= 0) throw new Error("Invalid amount");
                const bigAmount = ethers.utils.parseUnits(amount.toString(), decimals);
                tx = await contract.withdraw(bigAmount);
                await toast.promise(tx.wait(), {
                    pending: 'Unstaking...',
                    success: 'Unstaked successfully!',
                    error: 'Unstaking failed'
                });
                setAmount('');
            }

            // Update Data
            await update();
            
            // Update Token Balance
            const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
            const tbalance = await tokenContract.balanceOf(walletAddress);
            dispatch(setBalance(parseInt(tbalance.toString())));

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                     <Typography variant="h5" fontWeight={700}>
                        Manage Stake
                    </Typography>
                    <Chip icon={<PaidIcon />} label="Rewards" color="secondary" size="small" />
                </Stack>
               
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Unstake your EBONDS or claim your accumulated ESIR rewards.
                </Typography>

                {/* Withdraw Input */}
                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary">Amount to Unstake</Typography>
                        <Typography variant="caption" fontWeight={600}>
                            {stakedFormatted.toFixed(2)} Staked
                        </Typography>
                    </Stack>
                    
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: '1.5rem', fontWeight: 700 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button 
                                        onClick={() => setAmount(stakedFormatted.toString())} 
                                        size="small" 
                                        sx={{ borderRadius: 20, fontWeight: 700 }}
                                    >
                                        MAX
                                    </Button>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                <Stack spacing={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        disabled={loading || !walletAddress}
                        onClick={() => handleAction(false)}
                        sx={{ borderRadius: 3, fontWeight: 700, borderWidth: 2 }}
                    >
                        Unstake EBONDS
                    </Button>
                    
                    <Divider>OR</Divider>

                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={loading || !walletAddress}
                        onClick={() => handleAction(true)}
                        sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 'none' }}
                    >
                        Claim Rewards Only
                    </Button>
                </Stack>

            </CardContent>
        </Card>
    );
}

export default WithdrawCard;