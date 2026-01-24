import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Stack, Chip, Divider } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ShieldIcon from '@mui/icons-material/Shield';

import PresaleCard from './components/Presale/PresaleCard';
import TierTable from './components/TierTable/TierTable';
import BuybackStats from './components/BuybackStats/BuybackStats';

const SalesPage = () => {
    const [selectedTierAmount, setSelectedTierAmount] = useState(0);

    return (
        <Box sx={{ 
            minHeight: '100vh',
            pt: { xs: 12, md: 16 },
            pb: 12,
            bgcolor: '#05090f', // Very dark base
            background: 'radial-gradient(circle at 15% 15%, rgba(210, 157, 92, 0.08), transparent 25%), radial-gradient(circle at 85% 85%, rgba(100, 116, 139, 0.1), transparent 25%)'
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={8}>
                    
                    {/* LEFT COLUMN: The Strategy */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ mb: 8 }}>
                             <Chip 
                                label="STRATEGIC PIVOT 2026" 
                                sx={{ 
                                    mb: 3, 
                                    fontWeight: 800, 
                                    bgcolor: 'rgba(210, 157, 92, 0.1)', 
                                    color: '#d29d5c', 
                                    border: '1px solid rgba(210, 157, 92, 0.2)' 
                                }} 
                             />
                            <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1 }}>
                                Real Yield <br />
                                <span style={{ color: '#d29d5c' }}>Architecture</span>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, lineHeight: 1.8 }}>
                                We are phasing out inflationary rewards. By deploying <strong>on-chain bots</strong> on Bitcoin and Chainlink, we generate external revenue to support the $0.90 buyback target and ecosystem flywheel.
                            </Typography>
                        </Box>

                        {/* Strategy Grid */}
                        <Grid container spacing={4} sx={{ mb: 8 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                    <SmartToyIcon sx={{ fontSize: 40, color: '#d29d5c', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={700} color="white" gutterBottom>Automated Trading</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        Capital is deployed into low and higher frequency grid and exposure bots.
                                        <br/><br/>
                                        • <strong>40% BTC Bots</strong> (Conservative)<br/>
                                        • <strong>60% LINK Bots</strong> (Growth)
                                    </Typography>
                                </Box>
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                    <ShieldIcon sx={{ fontSize: 40, color: '#d29d5c', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={700} color="white" gutterBottom>Volatility Harvesting</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        We capture volatility-driven gains without requiring market timing .
                                        <br/><br/>
                                        • Backtested APY: <strong>35-50%</strong><br/>
                                        • Revenue -{'>'} Buybacks
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <TierTable onSelect={setSelectedTierAmount} />
                        
                        <Box sx={{ mt: 8 }}>
                             <BuybackStats />
                        </Box>
                    </Grid>

                    {/* RIGHT COLUMN: The Order Form */}
                    <Grid item xs={12} md={5}>
                        <PresaleCard selectedAmount={selectedTierAmount} />
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default SalesPage;