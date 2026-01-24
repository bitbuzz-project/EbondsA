import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    AppBar, Box, Toolbar, Button, Stack, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Divider, Typography 
} from '@mui/material'; // FIX: Added Typography
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWeb3React } from '@web3-react/core';
import AccountDialog from './components/accountDialog/AccountDialog';
import Logo from '../../resources/logo_white.svg'; 

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    
    const { account } = useWeb3React();
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll listener for glass effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const pages = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Staking', link: '/allocation-staking' },
        { name: 'Private Sale', link: '/sales' },
        { name: 'Swap', link: '/swap' }, 
        
    ];

    const handleNavClick = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: 1200, 
                    // Professional Glassmorphism
                    bgcolor: isScrolled ? 'rgba(5, 9, 15, 0.85)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    py: isScrolled ? 1 : 2.5 
                }}
            >
                <Box maxWidth="xl" sx={{ mx: 'auto', width: '100%', px: { xs: 2, md: 6 } }}>
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 70, md: 80 } }}>
                        
                        {/* Logo Area - INCREASED SIZE */}
                        <Box 
                            component="img" 
                            src={Logo} 
                            alt="Ebonds" 
                            sx={{ 
                                height: { xs: 32, md: 44 }, // Bigger size
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.05)' }
                            }} 
                            onClick={() => navigate('/')} 
                        />

                        {/* DESKTOP MENU - New "Pill" Design */}
                        <Stack 
                            direction="row" 
                            spacing={0.5} 
                            sx={{ 
                                display: { xs: 'none', md: 'flex' }, 
                                bgcolor: isScrolled ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)', 
                                p: 0.75, 
                                borderRadius: 10, 
                                border: '1px solid rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(4px)'
                            }}
                        >
                            {pages.map((page) => {
                                const isActive = location.pathname === page.link;
                                return (
                                    <Button
                                        key={page.name}
                                        onClick={() => navigate(page.link)}
                                        sx={{
                                            color: isActive ? '#000' : '#94a3b8',
                                            bgcolor: isActive ? '#d29d5c' : 'transparent',
                                            fontSize: '0.85rem',
                                            fontWeight: isActive ? 700 : 600,
                                            px: 2.5,
                                            py: 0.75,
                                            borderRadius: 8,
                                            minWidth: 'auto',
                                            transition: 'all 0.2s ease',
                                            '&:hover': { 
                                                color: isActive ? '#000' : '#fff',
                                                bgcolor: isActive ? '#d29d5c' : 'rgba(255,255,255,0.08)' 
                                            }
                                        }}
                                        disableRipple
                                    >
                                        {page.name}
                                    </Button>
                                );
                            })}
                        </Stack>

                        {/* RIGHT ACTIONS */}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            {!account ? (
                                <Button 
                                    variant="contained" 
                                    onClick={() => setShowDialog(true)} 
                                    sx={{ 
                                        fontWeight: 700, 
                                        px: 3,
                                        borderRadius: 8,
                                        boxShadow: '0 4px 14px 0 rgba(210, 157, 92, 0.3)',
                                        '&:hover': { boxShadow: '0 6px 20px 0 rgba(210, 157, 92, 0.5)' }
                                    }}
                                >
                                    Connect
                                </Button>
                            ) : (
                                <Button 
                                    variant="outlined" 
                                    startIcon={<AccountBalanceWalletIcon />}
                                    onClick={() => setShowDialog(true)}
                                    sx={{ 
                                        borderRadius: 8,
                                        borderColor: 'rgba(255,255,255,0.15)', 
                                        color: 'white',
                                        bgcolor: 'rgba(255,255,255,0.02)',
                                        px: 2.5,
                                        '&:hover': { 
                                            borderColor: '#d29d5c', 
                                            color: '#d29d5c',
                                            bgcolor: 'rgba(210, 157, 92, 0.05)'
                                        }
                                    }}
                                >
                                    {account.substring(0, 6)}...
                                </Button>
                            )}

                            <IconButton 
                                onClick={() => setMobileOpen(!mobileOpen)} 
                                sx={{ 
                                    display: { md: 'none' },
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 3,
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.05)'
                                }}
                            >
                                <MenuIcon fontSize="small" />
                            </IconButton>
                        </Stack>

                    </Toolbar>
                </Box>
            </AppBar>

            {/* MOBILE DRAWER */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{ 
                    sx: { 
                        width: '100%', 
                        maxWidth: 320, 
                        bgcolor: '#05090f', 
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0))',
                        borderLeft: '1px solid rgba(255,255,255,0.08)'
                    } 
                }}
            >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* DRAWER LOGO - INCREASED SIZE */}
                    <Box component="img" src={Logo} alt="Ebonds" sx={{ height: 32 }} />
                    <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                <List sx={{ px: 2, pt: 3 }}>
                    {pages.map((page) => {
                        const isActive = location.pathname === page.link;
                        return (
                            <ListItem key={page.name} disablePadding sx={{ mb: 1.5 }}>
                                <ListItemButton 
                                    onClick={() => handleNavClick(page.link)}
                                    sx={{ 
                                        borderRadius: 3,
                                        py: 1.5,
                                        bgcolor: isActive ? 'rgba(210, 157, 92, 0.08)' : 'transparent',
                                        border: isActive ? '1px solid rgba(210, 157, 92, 0.15)' : '1px solid transparent',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                                    }}
                                >
                                    <ListItemText 
                                        primary={page.name} 
                                        primaryTypographyProps={{ 
                                            fontWeight: isActive ? 700 : 500, 
                                            color: isActive ? '#d29d5c' : 'text.primary',
                                            fontSize: '1rem'
                                        }} 
                                    />
                                    {isActive && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#d29d5c' }} />}
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>

                <Box sx={{ mt: 'auto', p: 4 }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        size="large"
                        onClick={() => { setShowDialog(true); setMobileOpen(false); }}
                        sx={{ py: 2, borderRadius: 4, fontWeight: 700 }}
                    >
                        {account ? 'Manage Wallet' : 'Connect Wallet'}
                    </Button>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                         <Typography variant="caption" color="text.secondary">V 0.1.0 Beta</Typography>
                    </Box>
                </Box>
            </Drawer>

            <AccountDialog open={showDialog} setOpen={setShowDialog} />
        </>
    );
};

export default Header;