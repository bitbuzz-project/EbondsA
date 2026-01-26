import React from 'react';
import { Box, Container, Typography, Stack, IconButton, Divider, SvgIcon } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

// Assets
import Logo from '../../resources/logo_white.svg';

// Custom X (Twitter) Icon
const XIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

// Custom Discord Icon
const DiscordIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
  </SvgIcon>
);

const Footer = () => {
    
    const socialLinks = [
        { 
            icon: XIcon, 
            href: "https://x.com/EbondsFinance",
            label: "X (Twitter)"
        },
        { 
            icon: DiscordIcon, 
            href: "https://discord.gg/vM4YC6WxSd",
            label: "Discord"
        },
        { 
            icon: ArticleIcon, 
            href: "https://medium.com/@EBONDS.Finance/ebonds-finance-whitepaper-69d5164235ea",
            label: "Medium Whitepaper"
        }
    ];

    return (
        <Box component="footer" sx={{ 
            bgcolor: '#020407', 
            borderTop: '1px solid rgba(255,255,255,0.05)', 
            pt: 6, 
            pb: 6 
        }}>
            <Container maxWidth="lg">
                <Stack alignItems="center" spacing={3}>
                    
                    {/* 1. Logo */}
                    <Box component="img" src={Logo} sx={{ height: 36, opacity: 1 }} />
                    
                    {/* 2. Tagline */}
                    <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ 
                            maxWidth: 500, 
                            lineHeight: 1.6,
                            fontSize: '1rem' 
                        }}
                    >
                       On-chain Systematic Bots. Harvesting Volatility. Accelerating Flywheel.
                    </Typography>

                    {/* 3. Icon Links (Mapped with Hrefs) */}
                    <Stack direction="row" spacing={2}>
                        {socialLinks.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <IconButton 
                                    key={i} 
                                    component="a"
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    sx={{ 
                                        color: '#94a3b8', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                            color: '#d29d5c', 
                                            borderColor: '#d29d5c',
                                            transform: 'translateY(-2px)'
                                        } 
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            );
                        })}
                    </Stack>

                </Stack>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 5, width: '50%', mx: 'auto' }} />

                {/* 4. Copyright & Disclaimer */}
                <Box sx={{ textAlign: 'center', opacity: 0.6 }}>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                        © 2026 Ebonds Finance. All rights reserved.
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', display: 'block', fontSize: '0.7rem', lineHeight: 1.6 }}>
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