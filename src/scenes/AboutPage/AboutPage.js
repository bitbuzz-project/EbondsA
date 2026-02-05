import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { SwapWidget } from '@uniswap/widgets';
import { useWeb3React } from '@web3-react/core';

// Asset Imports
import ArbitrumLogo from '../../resources/arbitrum.svg'; 

// --- 1. CONFIGURATION (Hardcoded Addresses) ---
const EBONDS_ADDRESS = '0x53Ee546eB38fB2C8b870f56DeeaeCF80367a4551';
const ESIR_ADDRESS = '0x8C75a1C86C21b74754FC8e3Bc4e7f79B4fCC5a28';
const USDC_E_ADDRESS = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'; // Arbitrum USDC.e (Bridged)
const USDC_NATIVE_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // Arbitrum USDC (Native)

const JSON_RPC_URL = 'https://arb1.arbitrum.io/rpc'; 

// --- 2. TOKEN LISTS ---
// Visible tokens (shown in dropdown)
const VISIBLE_TOKENS = [
  {
    name: 'USD Coin (Bridged)',
    address: USDC_E_ADDRESS,
    symbol: 'USDC.e',
    decimals: 6,
    chainId: 42161,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  {
    name: 'USD Coin (Native)',
    address: USDC_NATIVE_ADDRESS,
    symbol: 'USDC',
    decimals: 6,
    chainId: 42161,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  {
    name: 'Ebonds',
    address: EBONDS_ADDRESS,
    symbol: 'EBONDS',
    decimals: 18,
    chainId: 42161,
    logoURI: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  {
    name: 'Esir',
    address: ESIR_ADDRESS,
    symbol: 'ESIR',
    decimals: 18,
    chainId: 42161,
    logoURI: 'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  }
];

// Hidden routing tokens (for multi-hop but not in dropdown)
const ROUTING_TOKENS = [
  {
    name: 'Wrapped Ether',
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    symbol: 'WETH',
    decimals: 18,
    chainId: 42161,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  {
    name: 'Arbitrum',
    address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    symbol: 'ARB',
    decimals: 18,
    chainId: 42161,
    logoURI: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg'
  },
  {
    name: 'Dai Stablecoin',
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    symbol: 'DAI',
    decimals: 18,
    chainId: 42161,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  },
  {
    name: 'Tether USD',
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    symbol: 'USDT',
    decimals: 6,
    chainId: 42161,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
  }
];

// Combined list for widget (all tokens available for routing)
const FULL_TOKEN_LIST = [...VISIBLE_TOKENS, ...ROUTING_TOKENS];

const goldTheme = {
  primary: '#FFFFFF',
  secondary: '#94a3b8',
  interactive: '#131a25',
  container: '#0a1019',
  module: '#05090f',
  accent: '#d29d5c',
  outline: '#293245',
  dialog: '#0a1019',
  fontFamily: '"Space Grotesk", sans-serif',
  borderRadius: 0.5,
};

const AddressRow = ({ label, address }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ bgcolor: 'rgba(0,0,0,0.3)', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" color="primary.main" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                    {address}
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy Address"}>
                    <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? 'success.main' : 'text.secondary' }}>
                        {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
};

const AboutPage = () => {
    const { library } = useWeb3React();

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            pt: { xs: 12, md: 16 }, 
            pb: 8,
            bgcolor: '#05090f',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(210, 157, 92, 0.03), transparent 50%)'
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={8} justifyContent="center" alignItems="flex-start">
                    
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 4 }}>
                            <Chip 
                                icon={<img src={ArbitrumLogo} alt="Arb" style={{ width: 16, height: 16 }} />}
                                label="Arbitrum One" 
                                sx={{ bgcolor: 'rgba(45, 55, 75, 0.5)', color: '#96bedc', fontWeight: 700, mb: 2 }} 
                            />
                            <Typography variant="h2" fontWeight={700} color="white" gutterBottom>
                                Instant <span style={{ color: '#d29d5c' }}>Swap</span>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                Exchange assets securely with zero platform fees. 
                                Liquidity is routed through the most efficient pools on Arbitrum.
                            </Typography>
                        </Box>

                        <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 2, bgcolor: 'rgba(210, 157, 92, 0.1)', borderRadius: 1, border: '1px solid rgba(210, 157, 92, 0.3)' }}>
                                <Typography variant="body2" color="#d29d5c">
                                    ⚠️ <strong>Important:</strong> You need ETH in your wallet to pay for gas fees when swapping.
                                </Typography>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="subtitle2" fontWeight={700} color="white" gutterBottom sx={{ mb: 3, letterSpacing: '0.1em' }}>
                                OFFICIAL CONTRACTS
                            </Typography>
                            
                            <AddressRow label="EBONDS Token" address={EBONDS_ADDRESS} />
                            <AddressRow label="ESIR Token" address={ESIR_ADDRESS} />
                            <AddressRow label="USDC (Native)" address={USDC_NATIVE_ADDRESS} />
                            <AddressRow label="USDC.e (Bridged)" address={USDC_E_ADDRESS} />
                            
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}>
                                *Always verify the contract address before trading.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Box sx={{ 
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}>
                            <div className="Uniswap">
                                <SwapWidget
                                    provider={library} 
                                    jsonRpcUrlMap={{ 42161: JSON_RPC_URL }}
                                    defaultChainId={42161} 
                                    theme={goldTheme}
                                    width="100%"
                                    tokenList={FULL_TOKEN_LIST}
                                    defaultInputTokenAddress={USDC_E_ADDRESS}
                                    defaultOutputTokenAddress={EBONDS_ADDRESS}
                                />
                            </div>
                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default AboutPage;