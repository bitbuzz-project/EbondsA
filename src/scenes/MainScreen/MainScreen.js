import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Container, 
    Grid, 
    Typography, 
    Paper, 
    Stack, 
    Divider,
    Button,
    Chip,
    Skeleton,
    IconButton
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import HistoryIcon from '@mui/icons-material/History';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PublishIcon from '@mui/icons-material/Publish'; 
import GetAppIcon from '@mui/icons-material/GetApp'; 

// Import dynamic price fetchers from services
import { fetchEbPrice, fetchUSDTPrice } from '../../services/prices';

// Import ONLY what exists
import { 
    stakingContractAddress, 
} from '../AllocationStaking/services/consts';

// --- FIXED ADDRESSES ---
const EBONDS_ADDRESS = '0x53Ee546eB38fB2C8b870f56DeeaeCF80367a4551';
const ESIR_ADDRESS = '0x8C75a1C86C21b74754FC8e3Bc4e7f79B4fCC5a28';

// --- CONFIG ---
const FIXED_DECIMALS = 18;
const COLORS = ['#d29d5c', '#64748b', '#ffffff'];

// Minimal ERC20 ABI
const TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const StatBox = ({ label, value, subValue }) => (
    <Box sx={{ p: 3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing="0.1em">
            {label}
        </Typography>
        <Typography variant="h4" fontWeight={700} color="white" sx={{ mt: 1, fontFamily: '"Space Grotesk", sans-serif' }}>
            {value}
        </Typography>
        {subValue && (
            <Typography variant="body2" color="primary.main" sx={{ mt: 0.5, fontWeight: 600 }}>
                {subValue}
            </Typography>
        )}
    </Box>
);

const MainScreen = () => {
    const { account, library } = useWeb3React();
    
    // --- STATE ---
    const [balances, setBalances] = useState({ ebonds: 0, esir: 0 });
    const [prices, setPrices] = useState({ EBONDS: 0, ESIR: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- SMART LABELING HELPER ---
    const getTxType = (from, to) => {
        const f = from.toLowerCase();
        const t = to.toLowerCase();
        const me = account.toLowerCase();
        const stake = stakingContractAddress.toLowerCase();

        if (t === stake) return { label: 'Staked', icon: <PublishIcon fontSize="small" /> };
        if (f === stake) return { label: 'Unstaked/Claimed', icon: <GetAppIcon fontSize="small" /> };
        if (f === me) return { label: 'Sent', icon: <ArrowOutwardIcon fontSize="small" /> };
        if (t === me) return { label: 'Received', icon: <GetAppIcon fontSize="small" /> };

        return { label: 'Transaction', icon: <SwapHorizIcon fontSize="small" /> };
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. FETCH DYNAMIC PRICES
                const [ebPrice, esirPrice] = await Promise.all([
                    fetchEbPrice(),
                    fetchUSDTPrice() 
                ]);
                setPrices({ 
                    EBONDS: parseFloat(ebPrice) || 0, 
                    ESIR: parseFloat(esirPrice) || 0 
                });

                if (account && library) {
                    const ebondsContract = new ethers.Contract(EBONDS_ADDRESS, TOKEN_ABI, library);
                    const esirContract = new ethers.Contract(ESIR_ADDRESS, TOKEN_ABI, library);
                    
                    // 2. FETCH BALANCES
                    const [ebBalanceRaw, esBalanceRaw] = await Promise.all([
                        ebondsContract.balanceOf(account),
                        esirContract.balanceOf(account)
                    ]);

                    setBalances({ 
                        ebonds: parseFloat(ethers.utils.formatUnits(ebBalanceRaw, FIXED_DECIMALS)), 
                        esir: parseFloat(ethers.utils.formatUnits(esBalanceRaw, FIXED_DECIMALS)) 
                    });

                    // 3. FETCH TOKEN HISTORY 
                    const currentBlock = await library.getBlockNumber();
                    const fromBlock = Math.max(0, currentBlock - 500000);

                    const filterEbondsIn = ebondsContract.filters.Transfer(null, account);
                    const filterEbondsOut = ebondsContract.filters.Transfer(account, null);
                    const filterEsirIn = esirContract.filters.Transfer(null, account);
                    const filterEsirOut = esirContract.filters.Transfer(account, null);

                    const [ebIn, ebOut, esIn, esOut] = await Promise.all([
                        ebondsContract.queryFilter(filterEbondsIn, fromBlock),
                        ebondsContract.queryFilter(filterEbondsOut, fromBlock),
                        esirContract.queryFilter(filterEsirIn, fromBlock),
                        esirContract.queryFilter(filterEsirOut, fromBlock)
                    ]);

                    const formatLog = (log, tokenName) => {
                        const amount = parseFloat(ethers.utils.formatUnits(log.args.value, FIXED_DECIMALS));
                        const type = getTxType(log.args.from, log.args.to);
                        
                        return {
                            action: `${type.label} ${tokenName}`,
                            amount: `${type.label === 'Sent' || type.label === 'Staked' ? '-' : '+'}${amount.toFixed(2)}`,
                            rawAmount: amount,
                            hash: log.transactionHash,
                            blockNumber: log.blockNumber,
                            icon: type.icon,
                            color: (type.label === 'Received' || type.label.includes('Unstaked')) ? 'success.main' : 'error.main'
                        };
                    };

                    const allTx = [
                        ...ebIn.map(l => formatLog(l, 'EBONDS')),
                        ...ebOut.map(l => formatLog(l, 'EBONDS')),
                        ...esIn.map(l => formatLog(l, 'ESIR')),
                        ...esOut.map(l => formatLog(l, 'ESIR'))
                    ].sort((a, b) => b.blockNumber - a.blockNumber);

                    setHistory(allTx.slice(0, 7));
                }

            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [account, library]);

    // Derived Values
    const ebondsValue = balances.ebonds * prices.EBONDS;
    const esirValue = balances.esir * prices.ESIR;
    const totalValue = ebondsValue + esirValue;

    const data = [
        { name: 'EBONDS', value: ebondsValue },
        { name: 'ESIR', value: esirValue },
    ];
    const chartData = data.filter(d => d.value > 0);
    if (chartData.length === 0) chartData.push({ name: 'Empty', value: 1 });

    // Format as whole numbers without decimals
    const formatWhole = (num) => {
        if (!num || num === 0) return "0";
        return Math.floor(num).toLocaleString(undefined, { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
        });
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            pt: { xs: 12, md: 16 }, 
            pb: 8,
            bgcolor: '#05090f',
            backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(210, 157, 92, 0.05), transparent 40%)'
        }}>
            <Container maxWidth="xl">
                
                {/* HEADER */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing="0.2em">
                            PORTFOLIO OVERVIEW
                        </Typography>
                        <Typography variant="h2" fontWeight={700} color="white">
                            Dashboard
                        </Typography>
                    </Box>
                    <Chip 
                        icon={<AccountBalanceWalletIcon sx={{ fontSize: '1rem !important', color: '#000 !important' }} />} 
                        label={account ? `${account.substring(0,6)}...${account.substring(account.length-4)}` : "Not Connected"} 
                        sx={{ bgcolor: '#d29d5c', color: 'black', fontWeight: 700 }}
                    />
                </Box>

                <Grid container spacing={4}>
                    
                    {/* COL 1: Net Worth & Stats */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Paper sx={{ 
                                    p: 5, 
                                    bgcolor: '#0a1019', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            ESTIMATED NET WORTH
                                        </Typography>
                                        <Typography variant="h2" fontWeight={700} color="white" sx={{ fontFamily: 'monospace' }}>
                                            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </Typography>
                                    </Box>
                                    <Button variant="outlined" endIcon={<ArrowOutwardIcon />}>
                                        View Analytics
                                    </Button>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StatBox 
                                    label="EBONDS HOLDINGS" 
                                    value={formatWhole(balances.ebonds)} 
                                    subValue={`≈ $${ebondsValue.toFixed(2)}`}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StatBox 
                                    label="ESIR HOLDINGS" 
                                    value={formatWhole(balances.esir)} 
                                    subValue={`≈ $${esirValue.toFixed(2)}`}
                                />
                            </Grid>

                            {/* Token Activity Section */}
                            <Grid item xs={12}>
                                <Box sx={{ mt: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                        <HistoryIcon color="primary" fontSize="small" />
                                        <Typography variant="h6" fontWeight={700}>Token Activity (EBONDS & ESIR)</Typography>
                                    </Stack>
                                    
                                    <Paper sx={{ border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'transparent' }}>
                                        {loading ? (
                                            <Box sx={{ p: 3 }}><Skeleton animation="wave" height={40} /><Skeleton animation="wave" height={40} /></Box>
                                        ) : history.length === 0 ? (
                                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography color="text.secondary">No token activity found in recent blocks.</Typography>
                                            </Box>
                                        ) : (
                                            history.map((row, i) => (
                                                <Box key={row.hash + i} sx={{ 
                                                    p: 3, 
                                                    borderBottom: i !== history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                                                }}>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Box sx={{ 
                                                            p: 1, borderRadius: '50%', 
                                                            bgcolor: row.amount.includes('+') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                                                            color: row.amount.includes('+') ? 'success.main' : 'error.main'
                                                        }}>
                                                            {row.icon}
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body1" fontWeight={600} color="white">{row.action}</Typography>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography variant="caption" color="text.secondary">Block #{row.blockNumber}</Typography>
                                                                <IconButton 
                                                                    size="small" 
                                                                    href={`https://arbiscan.io/tx/${row.hash}`} 
                                                                    target="_blank"
                                                                    sx={{ color: 'rgba(255,255,255,0.2)', p: 0 }}
                                                                >
                                                                    <OpenInNewIcon sx={{ fontSize: 12 }} />
                                                                </IconButton>
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                    <Box textAlign="right">
                                                        <Typography variant="body1" fontWeight={600} color={row.color} fontFamily="monospace">
                                                            {row.amount}
                                                        </Typography>
                                                        <Chip label="Success" size="small" color="default" sx={{ height: 20, fontSize: '0.65rem', opacity: 0.7 }} />
                                                    </Box>
                                                </Box>
                                            ))
                                        )}
                                    </Paper>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* COL 2: Allocation Chart */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, height: '100%', bgcolor: '#0a1019', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Asset Allocation</Typography>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />
                            
                            <Box sx={{ height: 250, mb: 4 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#131a25', borderColor: '#334155', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => `$${value.toLocaleString()}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>

                            <Stack spacing={2}>
                                {data.map((item, index) => (
                                    <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index] }} />
                                            <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                            {totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default MainScreen;