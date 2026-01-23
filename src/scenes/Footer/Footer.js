import React from 'react';
import { Box, Container, Grid, Typography, Stack, IconButton, Divider, useTheme } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';

// Assets
import Logo from '../../resources/logo_white.svg'; // Or your text logo

const FooterLink = ({ text, href }) => (
    <Typography 
        component="a" 
        href={href} 
        target="_blank"
        sx={{ 
            display: 'block', 
            mb: 1.5, 
            color: 'text.secondary', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s',
            '&:hover': { color: '#d29d5c' }
        }}
    >
        {text}
    </Typography>
);

const FooterHeader = ({ text }) => (
    <Typography variant="subtitle2" fontWeight={700} color="white" sx={{ mb: 3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {text}
    </Typography>
);

const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: '#020407', borderTop: '1px solid rgba(255,255,255,0.05)', pt: 10, pb: 4 }}>
            <Container maxWidth="xl">
                <Grid container spacing={8} sx={{ mb: 8 }}>
                    
                    {/* COL 1: Brand Identity */}
                    <Grid item xs={12} md={4}>
                        <Box component="img" src={Logo} sx={{ height: 32, mb: 3, opacity: 0.9 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, lineHeight: 1.8, mb: 4 }}>
                            Institutional-grade decentralized bonds. 
                            Automating real yield generation through on-chain arbitrage strategies.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {[TwitterIcon, TelegramIcon, GitHubIcon, ArticleIcon].map((Icon, i) => (
                                <IconButton key={i} sx={{ color: 'text.secondary', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>

                    {/* COL 2: Protocol */}
                    <Grid item xs={6} md={2}>
                        <FooterHeader text="Protocol" />
                        <FooterLink text="Allocation Staking" href="/allocation-staking" />
                        <FooterLink text="Bond Marketplace" href="/sales" />
                        <FooterLink text="Capital efficiency" href="#" />
                        <FooterLink text="Tokenomics" href="#" />
                    </Grid>

                    {/* COL 3: Governance */}
                    <Grid item xs={6} md={2}>
                        <FooterHeader text="Governance" />
                        <FooterLink text="Proposal Forum" href="#" />
                        <FooterLink text="Vote (Snapshot)" href="#" />
                        <FooterLink text="Treasury Report" href="#" />
                        <FooterLink text="Delegation" href="#" />
                    </Grid>

                    {/* COL 4: Developers */}
                    <Grid item xs={6} md={2}>
                        <FooterHeader text="Developers" />
                        <FooterLink text="Documentation" href="#" />
                        <FooterLink text="Github" href="#" />
                        <FooterLink text="Audits" href="#" />
                        <FooterLink text="Bug Bounty" href="#" />
                    </Grid>

                     {/* COL 5: Legal */}
                     <Grid item xs={6} md={2}>
                        <FooterHeader text="Legal" />
                        <FooterLink text="Terms of Service" href="/terms" />
                        <FooterLink text="Privacy Policy" href="#" />
                        <FooterLink text="Risk Disclosure" href="#" />
                    </Grid>

                </Grid>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 4 }} />

                {/* DISCLAIMER BLOCK */}
                <Box sx={{ opacity: 0.5 }}>
                    <Typography variant="caption" display="block" color="text.secondary" paragraph>
                        © 2026 Ebonds Finance. All rights reserved.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: 'block' }}>
                        Disclaimer: EBONDS is a decentralized protocol. Nothing on this website constitutes financial advice or a recommendation to buy or sell any asset. 
                        Cryptocurrency trading involves a high level of risk and may not be suitable for all investors. 
                        The volatility harnessing strategies mentioned are algorithmic projections based on backtested data and do not guarantee future performance.
                        Users are responsible for their own due diligence and compliance with local regulations.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;