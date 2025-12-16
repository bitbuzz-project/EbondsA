import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem, 
  Container, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Stack,
  Chip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connector';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import store from "../../app/store";
import { setAddress, setBalance, setDecimal, setNewTokenBalance, setNewTokenDecimal } from './../../features/userWalletSlice';
import { ethers } from "ethers";
import { tokenContractAddress, abi as tokenAbi } from "../AllocationStaking/components/StakeCard/services/consts";
import { newTokenContractAddress, abi as newTokenAbi } from '../AllocationStaking/components/StakeCard/services/newTokenconsts';

// Import your existing logos/assets
import Logo from '../../resources/logoheader.svg'; 
import arbitrumLogo from '../../resources/arbitrum.svg';

import AccountDialog from "./components/accountDialog/AccountDialog";
import ErrorDialog from "../ErrorDialog/ErrorDialog";

const pages = [
  { name: 'Home', link: 'https://ebonds.finance/', external: true },
  { name: 'Dashboard', link: '/', external: false },
  { name: 'Earn', link: '/allocation-staking', external: false },
  { name: 'Swap', link: '/swap', external: false },
  { name: 'Docs', link: 'https://medium.com/@EBONDS.Finance/ebonds-finance-whitepaper-69d5164235ea', external: true },
  { name: 'Community', link: 'https://discord.com/invite/vM4YC6WxSd', external: true },
];

const { ethereum } = window;

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activate, deactivate, account, error } = useWeb3React();
  const [showDialog, setShowDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ show: false, message: '' });

  const navigate = useNavigate();
  const location = useLocation();

  // Redux Data
  const balance = useSelector(state => state.userWallet.balance);
  const decimals = useSelector(state => state.userWallet.decimal);

  // --- Wallet Logic (Kept from your original file) ---
  useEffect(() => {
    if (account) {
      store.dispatch(setAddress(account));
      const fetchBalances = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          
          const oldTokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
          const oldDecimals = await oldTokenContract.decimals();
          const oldBalance = await oldTokenContract.balanceOf(account);

          const newTokenContract = new ethers.Contract(newTokenContractAddress, newTokenAbi, signer);
          const newDecimals = await newTokenContract.decimals();
          const newBalance = await newTokenContract.balanceOf(account);

          store.dispatch(setDecimal(oldDecimals));
          store.dispatch(setBalance(parseInt(oldBalance.toString())));
          store.dispatch(setNewTokenDecimal(newDecimals));
          store.dispatch(setNewTokenBalance(parseInt(newBalance.toString())));
        } catch (err) {
          console.error("Error fetching balances:", err);
        }
      };
      fetchBalances();
    }
  }, [account]);

  useEffect(() => {
    activate(injected, (err) => console.log("Auto-connect non-critical error", err));
  }, []);

  const handleConnect = () => {
    activate(injected);
  };

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (page) => {
    if (page.external) {
      window.location.href = page.link;
    } else {
      navigate(page.link);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(20px)', bgcolor: 'rgba(255,255,255,0.9)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            
            {/* LOGO AREA */}
            <Box 
              component="img" 
              src={Logo} 
              alt="Logo" 
              sx={{ height: 40, cursor: 'pointer', mr: 4 }} 
              onClick={() => navigate('/')}
            />

            {/* DESKTOP MENU */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleNavClick(page)}
                  sx={{
                    my: 2,
                    color: location.pathname === page.link ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === page.link ? 700 : 500,
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* RIGHT SIDE ACTIONS */}
            <Stack direction="row" spacing={2} alignItems="center">
              
              {/* Network Chip (Visual Only for now based on your old code) */}
              <Chip 
                icon={<img src={arbitrumLogo} alt="Arb" width={20} />} 
                label="Arbitrum" 
                variant="outlined" 
                sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 600, borderColor: 'rgba(0,0,0,0.1)' }}
              />

              {/* Connect Wallet Button */}
              {!account ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AccountBalanceWalletIcon />}
                  onClick={handleConnect}
                  sx={{ borderRadius: 50, px: 3 }}
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  onClick={() => setShowDialog(true)}
                  sx={{ borderRadius: 50, borderColor: 'primary.main', color: 'primary.main', fontWeight: 700 }}
                >
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </Button>
              )}

              {/* Mobile Menu Icon */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleMobileMenuToggle}
                sx={{ display: { md: 'none' }, ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Stack>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{ sx: { width: 250, pt: 4 } }}
      >
        <List>
          {pages.map((page) => (
            <ListItem button key={page.name} onClick={() => handleNavClick(page)}>
              <ListItemText 
                primary={page.name} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === page.link ? 700 : 500,
                  color: location.pathname === page.link ? 'primary.main' : 'text.primary' 
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* DIALOGS */}
      <AccountDialog show={showDialog} setShow={setShowDialog} address={account} disconnect={deactivate} />
      <ErrorDialog show={errorDialog.show} message={errorDialog.message} setError={setErrorDialog} />
    </>
  );
};

export default Header;