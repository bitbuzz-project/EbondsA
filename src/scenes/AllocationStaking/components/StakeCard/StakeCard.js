import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BigNumber, ethers } from 'ethers';
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
  Slider
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { abi, stakingContractAddress } from './../../services/consts';
import { abi as tokenAbi, tokenContractAddress } from './services/consts';
import { setBalance, setDecimal } from './../../../../features/userWalletSlice';
import { selectAddress } from './../../../../features/userWalletSlice';
import { RpcProvider } from '../../../../consts/rpc';

const StakeCard = ({ update }) => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const [allowance, setAllowance] = useState(0);
    const [loading, setLoading] = useState(false);

    // Redux
    const balance = useSelector(state => state.userWallet.balance);
    const decimals = useSelector(state => state.userWallet.decimal);
    const walletAddress = useSelector(selectAddress);

    // Derived values
    const balanceFormatted = balance / Math.pow(10, decimals);
    
    useEffect(() => {
        if (!walletAddress) return;
        
        const fetchAllowance = async () => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
                const contract = new ethers.Contract(tokenContractAddress, tokenAbi, provider);
                const res = await contract.allowance(walletAddress, stakingContractAddress);
                setAllowance(parseFloat(ethers.utils.formatUnits(res, decimals)));
            } catch (error) {
                console.error("Allowance fetch error:", error);
            }
        };
        fetchAllowance();
    }, [walletAddress, decimals]);

    const handleMax = () => {
        setAmount(balanceFormatted.toString());
    };

    const updateBalance = async (signer) => {
        const contract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
        const tbalance = await contract.balanceOf(walletAddress);
        dispatch(setBalance(parseInt(tbalance.toString())));
    };

    const handleAction = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            const { ethereum } = window;
            if (!ethereum) throw new Error("No wallet found");

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            
            // Check Allowance
            if (parseFloat(amount) > allowance) {
                const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
                const tx = await tokenContract.approve(stakingContractAddress, ethers.constants.MaxUint256);
                await toast.promise(tx.wait(), {
                    pending: 'Approving EBONDS...',
                    success: 'Approved successfully!',
                    error: 'Approval failed'
                });
                setAllowance(parseFloat(amount) + 1000); // Optimistic update
            } else {
                // Deposit
                const stakingContract = new ethers.Contract(stakingContractAddress, abi, signer);
                const bigAmount = ethers.utils.parseUnits(amount.toString(), decimals);
                
                const tx = await stakingContract.deposit(bigAmount);
                await toast.promise(tx.wait(), {
                    pending: 'Staking EBONDS...',
                    success: 'Staked successfully!',
                    error: 'Staking failed'
                });
                
                setAmount('');
                await update(); // Update parent stats
                await updateBalance(signer);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    const isApprovalNeeded = parseFloat(amount) > allowance;

    return (
        <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Stake EBONDS
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Stake your tokens to earn high APY rewards.
                </Typography>

                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary">Amount to Stake</Typography>
                        <Typography variant="caption" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                            <AccountBalanceWalletIcon sx={{ fontSize: 14 }} /> 
                            {balanceFormatted.toFixed(2)} Available
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
                                        onClick={handleMax} 
                                        size="small" 
                                        sx={{ borderRadius: 20, fontWeight: 700, minWidth: 'auto', px: 2 }}
                                    >
                                        MAX
                                    </Button>
                                    <Typography variant="subtitle1" fontWeight={700} ml={1}>
                                        EBONDS
                                    </Typography>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={!walletAddress || loading || (parseFloat(amount) > balanceFormatted && !isApprovalNeeded)}
                    onClick={handleAction}
                    sx={{ 
                        borderRadius: 3, 
                        py: 1.5, 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        boxShadow: 'none'
                    }}
                >
                    {!walletAddress ? 'Connect Wallet' : loading ? 'Processing...' : isApprovalNeeded ? 'Approve EBONDS' : 'Stake Now'}
                </Button>

                {/* Optional Slider */}
                <Box sx={{ px: 1, mt: 2 }}>
                    <Slider 
                        value={amount ? (parseFloat(amount)/balanceFormatted)*100 : 0} 
                        onChange={(e, val) => setAmount(((balanceFormatted * val) / 100).toFixed(2))}
                        size="small"
                        disabled={!balanceFormatted}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default StakeCard;