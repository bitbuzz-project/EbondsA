import React from 'react';
import { Box, Container, Stack, Typography, IconButton, Divider } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Logo from '../../resources/logo_dark.svg'; 

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: 'background.paper', 
                py: 6, 
                borderTop: '1px solid', 
                borderColor: 'divider',
                mt: 'auto' // Pushes footer to bottom
            }}
        >
            <Container maxWidth="xl">
                <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    justifyContent="space-between" 
                    alignItems="center" 
                    spacing={4}
                >
                    {/* Logo Section */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <img src={Logo} alt="EBONDS" style={{ height: 40, marginBottom: 10 }} />
                        <Typography variant="body2" color="text.secondary">
                            The future of decentralized bonding and staking.
                        </Typography>
                    </Box>

                    {/* Links Section */}
                    <Stack direction="row" spacing={3}>
                        <Typography variant="body2" component="a" href="#" sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 600 }}>
                            Docs
                        </Typography>
                        <Typography variant="body2" component="a" href="#" sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 600 }}>
                            Governance
                        </Typography>
                        <Typography variant="body2" component="a" href="#" sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 600 }}>
                            Terms
                        </Typography>
                    </Stack>

                    {/* Socials */}
                    <Stack direction="row" spacing={1}>
                        <IconButton href="https://t.me/yourtelegram" target="_blank" color="primary">
                            <TelegramIcon />
                        </IconButton>
                        <IconButton href="https://twitter.com/yourtwitter" target="_blank" color="primary">
                            <TwitterIcon />
                        </IconButton>
                        <IconButton href="https://youtube.com/yourchannel" target="_blank" color="primary">
                            <YouTubeIcon />
                        </IconButton>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 4 }} />

                <Typography variant="caption" display="block" align="center" color="text.secondary">
                    © {new Date().getFullYear()} EBONDS Finance. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;