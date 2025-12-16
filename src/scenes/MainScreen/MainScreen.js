import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  LinearProgress, 
  Stack, 
  Chip,
  Avatar,
  Button
} from '@mui/material';

// Icons
import HistoryIcon from '@mui/icons-material/History';
import TokenIcon from '@mui/icons-material/Token'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Project Imports
import { RpcProvider } from '../../consts/rpc';
import { abi, stakingContractAddress } from './services/consts';
import { setBalance as setStakeBalance } from '../../features/stakingSlice'; 
import { fetchUSDTPrice, fetchEbPrice } from '../../services/prices';

// Sub-Components
import TransactionHistory from "./components/TransactionHistory/Info"; 
import CustomEBONDSChart from "./components/Transactionchart/Info"; 

// --- Helper Components ---
const PortfolioItem = ({ symbol, balance, price, iconColor }) => {
  const safePrice = Number(price) || 0;
  const safeBalance = Number(balance) || 0;
  const usdValue = safeBalance * safePrice;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      p: 2, 
      bgcolor: 'background.paper', 
      borderRadius: 2,
      mb: 1,
      boxShadow: '0px 2px 10px rgba(0,0,0,0.02)',
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: iconColor, width: 40, height: 40 }}>
          <TokenIcon sx={{ color: 'white' }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>{symbol}</Typography>
          <Typography variant="body2" color="text.secondary">
            {safeBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} {symbol}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle1" fontWeight={700}>
          ${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          @ ${safePrice.toFixed(4)}
        </Typography>
      </Box>
    </Box>
  );
};

const StatCard = ({ title, value, subtext, highlight }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {title} <InfoOutlinedIcon sx={{ fontSize: 14 }} />
      </Typography>
      <Typography variant="h4" fontWeight={700} color={highlight ? 'primary.main' : 'text.primary'}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtext}
      </Typography>
    </CardContent>
  </Card>
);

// --- Main Component ---

const MainScreen = () => {
  const dispatch = useDispatch();
  
  // Redux Data
  const address = useSelector(state => state.userWallet.address);
  const walletBalance = useSelector(state => state.userWallet.balance) / Math.pow(10, 18); 
  const newTokenBalance = useSelector(state => state.userWallet.newTokenBalance) / Math.pow(10, 18); 

  // Local State
  const [prices, setPrices] = useState({ ebond: 0, esir: 0 });
  const [stakingData, setStakingData] = useState({
    stakedAmount: 0,
    pendingRewards: 0,
    tvl: 0,
    totalDistributed: 0,
  });
  const [apy, setApy] = useState({ ebondsRoi: 0, esirApy: 0 });

  // --- Fetch Data ---
  useEffect(() => {
    let isMounted = true; // <--- 1. Flag to track mount status

    const init = async () => {
      try {
        let esirP = 0;
        let ebondP = 0;
        try {
            esirP = await fetchUSDTPrice();
            ebondP = await fetchEbPrice();
        } catch(err) {
            console.warn("Price fetch failed", err);
        }
        
        if (!isMounted) return; // <--- 2. Stop if unmounted

        setPrices({ 
            ebond: Number(ebondP) || 0, 
            esir: Number(esirP) || 0 
        });

        const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
        const contract = new ethers.Contract(stakingContractAddress, abi, provider);

        const tvlRaw = await contract.totalDeposits();
        const distRaw = await contract.paidOut();
        const tvl = parseFloat(ethers.utils.formatUnits(tvlRaw, 18));
        const dist = parseFloat(ethers.utils.formatUnits(distRaw, 18));

        let userStaked = 0;
        let userPending = 0;

        if (address) {
          const userInfo = await contract.userInfo(address);
          userStaked = parseFloat(ethers.utils.formatUnits(userInfo.amount, 18));
          
          try {
             const pending = await contract.pending(address); 
             userPending = parseFloat(ethers.utils.formatUnits(pending, 18));
          } catch(e) {}
          
          if(isMounted) dispatch(setStakeBalance(userStaked * Math.pow(10, 18))); 
        }

        if (!isMounted) return; // <--- 3. Stop if unmounted

        setStakingData({
          stakedAmount: userStaked,
          pendingRewards: userPending,
          tvl,
          totalDistributed: dist
        });

        const esirApyVal = ((((1 + (esirP / (0.865 * 1000))) ** 365) - 1) * 100);
        const ebondsRoiVal = ((ebondP / 0.865) - 1) * 100;
        
        setApy({ 
            esirApy: isNaN(esirApyVal) ? 0 : esirApyVal, 
            ebondsRoi: isNaN(ebondsRoiVal) ? 0 : ebondsRoiVal 
        });

      } catch (error) {
        console.error("Dashboard Data Error:", error);
      }
    };

    init();

    return () => { isMounted = false; }; // <--- 4. Cleanup function
  }, [address, dispatch]);

  const totalEbonds = (Number(walletBalance) || 0) + stakingData.stakedAmount;
  const totalEsir = (Number(newTokenBalance) || 0) + stakingData.pendingRewards;
  const totalBalanceUsd = (totalEbonds * prices.ebond) + (totalEsir * prices.esir);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Stack spacing={3}>
            <Card sx={{ overflow: 'visible' }}> 
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                      MY PORTFOLIO
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ my: 1 }}>
                      ${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                    </Typography>
                    <Chip label="Overall Funds" size="small" color="primary" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                     <Button variant="outlined" startIcon={<HistoryIcon />} disabled>
                        History
                     </Button>
                  </Box>
                </Stack>

                <Box sx={{ mb: 4 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={totalEbonds > 0 ? 50 : 0} 
                    sx={{ height: 8, borderRadius: 5, bgcolor: 'action.hover' }} 
                  />
                </Box>

                <PortfolioItem 
                  symbol="EBONDS" 
                  balance={totalEbonds} 
                  price={prices.ebond}
                  iconColor="#9E9E9E"
                />
                <PortfolioItem 
                  symbol="ESIR" 
                  balance={totalEsir} 
                  price={prices.esir}
                  iconColor="#000000" 
                />
              </CardContent>
            </Card>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Card sx={{ flex: 1, bgcolor: '#1a202c', color: 'white' }}>
                 <CardContent>
                   <Typography variant="body2" sx={{ opacity: 0.7 }}>EBONDS Real-Time ROI</Typography>
                   <Typography variant="h4" fontWeight={700} sx={{ my: 1, color: '#01C275' }}>
                     {apy.ebondsRoi.toFixed(2)}%
                   </Typography>
                   <Typography variant="caption" sx={{ opacity: 0.5 }}>Return on Investment</Typography>
                 </CardContent>
              </Card>

              <Card sx={{ flex: 1, bgcolor: '#1a202c', color: 'white' }}>
                 <CardContent>
                   <Typography variant="body2" sx={{ opacity: 0.7 }}>ESIR Real-Time APY</Typography>
                   <Typography variant="h4" fontWeight={700} sx={{ my: 1, color: '#01C275' }}>
                     {apy.esirApy.toFixed(2)}%
                   </Typography>
                   <Typography variant="caption" sx={{ opacity: 0.5 }}>Annual Percentage Yield</Typography>
                 </CardContent>
              </Card>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StatCard 
                  title="Total EBONDS Staked" 
                  value={stakingData.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  subtext={`$${(stakingData.tvl * prices.ebond).toLocaleString('en-US', { maximumFractionDigits: 0 })} Value`}
                  highlight
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                 <StatCard 
                  title="Total Distributed" 
                  value={`${stakingData.totalDistributed.toLocaleString('en-US', { maximumFractionDigits: 0 })} ESIR`}
                  subtext={`Total Rewards Paid Out`}
                />
              </Grid>
            </Grid>

          </Stack>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={3}>
            <CustomEBONDSChart />
            <Card>
              <CardContent>
                 <Typography variant="h6" fontWeight={700} gutterBottom>
                   Transaction History
                 </Typography>
                 <TransactionHistory account={address} tokenContractAddress={stakingContractAddress} />
              </CardContent>
            </Card>
          </Stack>
        </Grid>

      </Grid>
    </Box>
  );
}

export default MainScreen;