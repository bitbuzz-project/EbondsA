import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    AppBar, Box, Toolbar, Button, Stack, Drawer, IconButton, List, ListItem, ListItemText, useTheme, Chip 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWeb3React } from '@web3-react/core';
import AccountDialog from './components/accountDialog/AccountDialog';
import Logo from '../../resources/logo_white.svg'; 

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false); // Controls the Dialog
    
    const { account } = useWeb3React();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const pages = [
        { name: 'Home', link: '/' },
        { name: 'Staking', link: '/allocation-staking' },
        { name: 'Private Sale', link: '/sales' },
        { name: 'Swap', link: '/swap' }, 
        { name: 'Dashboard', link: '/dashboard' }
    ];

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: 1100, // MAX PRIORITY
                    bgcolor: isScrolled ? 'rgba(5, 9, 15, 0.95)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease-in-out',
                    py: isScrolled ? 0.5 : 2 
                }}
            >
                <Box maxWidth="xl" sx={{ mx: 'auto', width: '100%', px: { xs: 2, md: 6 } }}>
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
                        
                        <Box component="img" src={Logo} alt="Ebonds" sx={{ height: 32, cursor: 'pointer' }} onClick={() => navigate('/')} />

                        <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => {
                                const isActive = location.pathname === page.link;
                                return (
                                    <Button
                                        key={page.name}
                                        onClick={() => navigate(page.link)}
                                        sx={{
                                            color: isActive ? '#d29d5c' : '#94a3b8',
                                            fontSize: '0.95rem',
                                            fontWeight: isActive ? 700 : 500,
                                            textTransform: 'none',
                                            minWidth: 'auto',
                                            '&:hover': { color: '#d29d5c', bgcolor: 'transparent' }
                                        }}
                                        disableRipple
                                    >
                                        {page.name}
                                    </Button>
                                );
                            })}
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                            {!account ? (
                                <Button 
                                    variant="contained" 
                                    onClick={() => setShowDialog(true)} // Opens Dialog
                                    sx={{ 
                                        borderRadius: 1, bgcolor: '#d29d5c', color: '#000', fontWeight: 700, px: 3,
                                        '&:hover': { bgcolor: '#e3b578' }
                                    }}
                                >
                                    Connect Wallet
                                </Button>
                            ) : (
                                <Button 
                                    variant="outlined" 
                                    startIcon={<AccountBalanceWalletIcon />}
                                    onClick={() => setShowDialog(true)} // Opens Dialog
                                    sx={{ 
                                        borderRadius: 1, borderColor: 'rgba(255,255,255,0.2)', color: 'white',
                                        '&:hover': { borderColor: '#d29d5c', color: '#d29d5c' }
                                    }}
                                >
                                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                                </Button>
                            )}

                            <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                        </Stack>

                    </Toolbar>
                </Box>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{ sx: { width: 240, bgcolor: '#0a1019', borderLeft: '1px solid rgba(255,255,255,0.1)' } }}
            >
                <List sx={{ pt: 4 }}>
                    {pages.map((page) => (
                        <ListItem button key={page.name} onClick={() => { navigate(page.link); setMobileOpen(false); }}>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontWeight: 700, color: 'white' }} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Passing BOTH setOpen and handleClose patterns to be safe */}
            <AccountDialog 
                open={showDialog} 
                setOpen={setShowDialog} 
                onClose={() => setShowDialog(false)} 
            />
        </>
    );
};

export default Header;