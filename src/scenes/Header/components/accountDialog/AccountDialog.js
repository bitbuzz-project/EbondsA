import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Stack, 
  Divider, 
  Avatar,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import MetamaskLogo from '../../../../resources/metamask.svg'; 
// import WalletConnectLogo from '../../../../resources/walletconnect.svg'; <--- REMOVED MISSING FILE IMPORT

import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from '../../../../connector';
import { toast } from 'react-toastify';

const AccountDialog = ({ show, setShow }) => {
  const { active, account, activate, deactivate } = useWeb3React();

  const handleConnect = async (connector) => {
    try {
      await activate(connector);
      setShow(false);
      toast.success("Wallet Connected!");
    } catch (error) {
      console.error(error);
      toast.error("Connection Failed");
    }
  };

  const handleDisconnect = () => {
    deactivate();
    setShow(false);
    toast.info("Wallet Disconnected");
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    toast.success("Address Copied!");
  };

  return (
    <Dialog 
      open={show} 
      onClose={() => setShow(false)} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 0 }}>
        <Typography variant="h6" fontWeight={700}>
          {active ? 'Account' : 'Connect Wallet'}
        </Typography>
        <IconButton onClick={() => setShow(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {!active ? (
          <Stack spacing={2}>
            <ConnectorButton 
              name="MetaMask" 
              icon={MetamaskLogo} 
              onClick={() => handleConnect(injected)} 
            />
            
            {/* WalletConnect Button (Icon removed to fix error) */}
            <ConnectorButton 
              name="WalletConnect" 
              // icon={WalletConnectLogo} <--- Removed icon prop
              onClick={() => handleConnect(walletconnect)} 
            />
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
              <AccountBalanceWalletIcon fontSize="large" color="inherit" />
            </Avatar>
            
            <Typography variant="body2" color="text.secondary">Connected with MetaMask</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ my: 1 }}>
              {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
            </Typography>

            <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2, mb: 4 }}>
              <Tooltip title="Copy Address">
                <Button 
                    startIcon={<ContentCopyIcon />} 
                    size="small" 
                    color="inherit" 
                    onClick={copyAddress}
                >
                    Copy
                </Button>
              </Tooltip>
              <Tooltip title="View on Arbiscan">
                <Button 
                    startIcon={<OpenInNewIcon />} 
                    size="small" 
                    color="inherit" 
                    href={`https://arbiscan.io/address/${account}`} 
                    target="_blank"
                >
                    Explorer
                </Button>
              </Tooltip>
            </Stack>

            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<LogoutIcon />} 
              fullWidth 
              onClick={handleDisconnect}
              sx={{ borderRadius: 3 }}
            >
              Disconnect Wallet
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ConnectorButton = ({ name, icon, onClick }) => (
  <Button
    onClick={onClick}
    fullWidth
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      borderRadius: 3,
      bgcolor: 'background.default',
      color: 'text.primary',
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
    }}
  >
    <Typography fontWeight={600}>{name}</Typography>
    {/* Only render image if icon exists */}
    {icon ? <img src={icon} alt={name} width={30} /> : <AccountBalanceWalletIcon color="action" />}
  </Button>
);

export default AccountDialog;