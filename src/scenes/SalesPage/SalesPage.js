import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Stack, Chip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import VestingTimeline from './components/VestingTimeline/VestingTimeline';
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
            bgcolor: '#05090f', 
            background: 'radial-gradient(circle at 15% 15%, rgba(210, 157, 92, 0.08), transparent 25%), radial-gradient(circle at 85% 85%, rgba(100, 116, 139, 0.1), transparent 25%)'
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={8}>
                    
                    {/* LEFT COLUMN: REWARDS & STRATEGY */}
                    <Grid item xs={12} md={7}>
                        {/* 1. TOP SECTION: ALLOCATION BONUS TIERS - ROI AT TARGET BUYBACK */}
                        <Box sx={{ mb: 6 }}>
                            <TierTable onSelect={setSelectedTierAmount} />
                        </Box>

                        {/* 2. MIDDLE SECTION: SYSTEM DESCRIPTION */}
                        <Box sx={{ mb: 8 }}>
                             <Chip 
                                label="INFRASTRUCTURE COMPLETE | PRODUCTION READY" 
                                sx={{ 
                                    mb: 3, 
                                    fontWeight: 800, 
                                    bgcolor: 'rgba(210, 157, 92, 0.1)', 
                                    color: '#d29d5c', 
                                    border: '1px solid rgba(210, 157, 92, 0.2)',
                                    letterSpacing: '0.05em'
                                }} 
                             />
                            <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1 }}>
                                Systematic <br />
                                <span style={{ color: '#d29d5c' }}>Architecture</span>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, lineHeight: 1.8 }}>
                                The system is ready. We utilize <strong>active deployment</strong> strategies on Bitcoin and Chainlink to generate execution revenue, supporting the $0.90 buyback target through capital efficiency.
                            </Typography>
                        </Box>

                        {/* 3. STRATEGY MODULES */}
                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                    <SmartToyIcon sx={{ fontSize: 40, color: '#d29d5c', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={700} color="white" gutterBottom>Automated Execution</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        Capital is deployed into high-efficiency systematic strategies.
                                        <br/><br/>
                                        • <strong>40% BTC Strategy</strong> (Conservative)<br/>
                                        • <strong>60% LINK Strategy</strong> (Adaptive)
                                    </Typography>
                                </Box>
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                    <ShieldIcon sx={{ fontSize: 40, color: '#d29d5c', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={700} color="white" gutterBottom>Volatility Harvesting</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        Capturing volatility-driven alpha via rules-based on-chain systems.
                                        <br/><br/>
                                        • <strong>Active Deployment</strong><br/>
                                        • <strong>Systematic Buybacks</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 8 }}>
                             <BuybackStats />
                        </Box>
                    </Grid>

                    {/* RIGHT COLUMN: TRANSACTION & VESTING */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={4}>
                            {/* 1. PRESALE CARD */}
                            <PresaleCard selectedAmount={selectedTierAmount} />

                            {/* 2. SYSTEMATIC VESTING SCHEDULE CARD (STRICTLY UNDER PRESALE CARD) */}
                           
                        </Stack>
                        
                    </Grid>
                                    
                </Grid>
            </Container>
        </Box>
    );
};

export default SalesPage;