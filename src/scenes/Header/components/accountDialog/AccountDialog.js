import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Stack, 
  Avatar,
  Tooltip
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCodeIcon from '@mui/icons-material/QrCode';

// Resources
import MetamaskLogo from '../../../../resources/metamask.svg'; 
// import WalletConnectLogo from '../../../../resources/walletconnect.svg'; 

// Logic
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from '../../../../connector';
import { toast } from 'react-toastify';

const AccountDialog = ({ show, setShow }) => {
  const { active, account, activate, deactivate } = useWeb3React();

  // --- CONNECT LOGIC WITH AUTO-SWITCH ---
  const handleConnect = async (connector) => {
    try {
      // 1. Try connecting normally
      await activate(connector, undefined, true); 
      setShow(false);
      toast.success("Wallet Connected!");
    } catch (error) {
      console.error("Connection attempt failed:", error);
      
      // 2. If it fails (likely due to wrong network), try switching to Arbitrum
      if (window.ethereum) {
          try {
              await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0xa4b1' }], // 42161 (Arbitrum One)
              });
              
              // Retry connection after successful switch
              await activate(connector);
              setShow(false);
              toast.success("Connected to Arbitrum!");
          } catch (switchError) {
              
              // 3. If Arbitrum network is missing in wallet, add it
              if (switchError.code === 4902) {
                  try {
                      await window.ethereum.request({
                          method: 'wallet_addEthereumChain',
                          params: [{
                              chainId: '0xa4b1',
                              chainName: 'Arbitrum One',
                              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                              blockExplorerUrls: ['https://arbiscan.io/'],
                          }],
                      });
                      await activate(connector);
                      setShow(false);
                  } catch (addError) {
                      toast.error("Could not add Arbitrum network.");
                  }
              } else {
                  // Generic error (User rejected request, etc)
                  toast.warning("Please switch your wallet to Arbitrum One.");
              }
          }
      } else {
          toast.error("Connection failed. Check console.");
      }
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
        sx: { 
            borderRadius: 4, 
            p: 1, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            bgcolor: 'background.paper'
        }
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
            {/* MetaMask Button */}
            <ConnectorButton 
              name="MetaMask" 
              icon={MetamaskLogo} 
              onClick={() => handleConnect(injected)} 
            />
            
            {/* WalletConnect V2 Button */}
            <ConnectorButton 
              name="WalletConnect" 
              // icon={WalletConnectLogo}
              fallbackIcon={<QrCodeIcon color="action" />}
              onClick={() => handleConnect(walletconnect)} 
            />
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
              <AccountBalanceWalletIcon fontSize="large" color="inherit" />
            </Avatar>
            
            <Typography variant="body2" color="text.secondary">Connected</Typography>
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

// Helper Sub-Component
const ConnectorButton = ({ name, icon, fallbackIcon, onClick }) => (
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
      transition: '0.2s',
      '&:hover': { 
        bgcolor: 'action.hover', 
        borderColor: 'primary.main',
        transform: 'translateY(-2px)'
      }
    }}
  >
    <Typography fontWeight={600}>{name}</Typography>
    {/* Logic: Try to show Image, if fails or missing, show Fallback Icon, default to Wallet Icon */}
    {icon ? (
        <img src={icon} alt={name} width={30} onError={(e) => {e.target.style.display='none'}} />
    ) : (
        fallbackIcon || <AccountBalanceWalletIcon color="action" />
    )}
  </Button>
);

export default AccountDialog;