import { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import WalletIcon from './images/WalletIcon.svg'
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Snackbar from '@mui/material/Snackbar';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { ethers } from "ethers";
import {useSelector} from 'react-redux'


import classes from './../accountDialog/AccountDialog.module.scss'

const AccountDialog = ({ show, setShow, address, disconnect }) => {
    const theme = useTheme();
    const [showSnack, setShowSnack] = useState({ show: false, message: '' });
    const [network, setNetwork] = useState({name: "Arbitrum One"});
    const balance = useSelector((state)=>state.userWallet.balance)
    const decimals = useSelector((state)=>state.userWallet.decimal);

    const copiedToClipboard = () => toast.info('Address copied to clipboard', {
        icon: ({ theme, type }) => <ContentCopyIcon style={{ color: 'rgb(53, 150, 216)' }} />,
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const walletDisconnected = () =>
        toast.success('Wallet successfully disconnected', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    useEffect(async ()=>{
        if(!window.ethereum)
            return;

        const provider = new ethers.providers.Web3Provider(
            window.ethereum
        );
        const addresses = await provider.listAccounts(); 
        const network = await provider.getNetwork()
        setNetwork({...network});

    }, [address])


    return (
        <>
            <Dialog
                onClose={() => { setShow(false) }}
                open={show}
                className={classes.dialog}
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle>
                    <div className={classes.dialogHeader}>
                        <div>
                            Account
                        </div>
                        <div className={classes.closeIcon}>
                        <svg className={classes.closeIconsvg}  onClick={() => { setShow(false) }} aria-hidden="true" fill="none" height="10" viewBox="0 0 10 10" width="10" xmlns="http://www.w3.org/2000/svg"><path d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z" fill="currentColor"></path></svg>
                        </div>
                        {/* <CloseIcon  /> */}
                    </div>
                </DialogTitle>
                <DialogContent>
                    {<div className={classes.walletInfo}>
                        <div className={classes.walletIconWrapper}>
                            <AccountBalanceWalletIcon className={classes.walletIcon} />
                        </div>
                        <div className={classes.infoContainer}>
                            <div className={classes.infoItem}>
                                <h3>Balance</h3>
                                <p>{(balance/Math.pow(10, decimals)).toFixed(4)} EBONDS</p>
                            </div>

                            <div className={classes.infoItem}>
                                <h3>Network </h3>
                                <p>{network.name}</p>
                            </div>

                            <div className={classes.infoItem}>
                                <h3>Wallet</h3>
                                <p>{'Metamask'}</p>
                            </div>
                        </div>
                    </div>}

                    <div className={classes.addressField}>
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            variant="filled"
                            label="Wallet address"
                            defaultValue={address}
                        />
                    </div>

                    <div className={classes.actions}>
                        <div className={classes.element} onClick={() => { navigator.clipboard.writeText(address); copiedToClipboard() }}>
                        <svg fill="none" height="16" viewBox="0 0 17 16" width="17" xmlns="http://www.w3.org/2000/svg"><path d="M3.04236 12.3027H4.18396V13.3008C4.18396 14.8525 5.03845 15.7002 6.59705 15.7002H13.6244C15.183 15.7002 16.0375 14.8525 16.0375 13.3008V6.24609C16.0375 4.69434 15.183 3.84668 13.6244 3.84668H12.4828V2.8418C12.4828 1.29688 11.6283 0.442383 10.0697 0.442383H3.04236C1.48376 0.442383 0.629272 1.29004 0.629272 2.8418V9.90332C0.629272 11.4551 1.48376 12.3027 3.04236 12.3027ZM3.23376 10.5391C2.68689 10.5391 2.39294 10.2656 2.39294 9.68457V3.06055C2.39294 2.47949 2.68689 2.21289 3.23376 2.21289H9.8783C10.4252 2.21289 10.7191 2.47949 10.7191 3.06055V3.84668H6.59705C5.03845 3.84668 4.18396 4.69434 4.18396 6.24609V10.5391H3.23376ZM6.78845 13.9365C6.24158 13.9365 5.94763 13.6699 5.94763 13.0889V6.45801C5.94763 5.87695 6.24158 5.61035 6.78845 5.61035H13.433C13.9799 5.61035 14.2738 5.87695 14.2738 6.45801V13.0889C14.2738 13.6699 13.9799 13.9365 13.433 13.9365H6.78845Z" fill="currentColor"></path></svg>
                            <div className={classes.width}>
                                Copy Address
                            </div>
                        </div>

                        <div className={classes.element} onClick={() => { setShow(false); disconnect(); walletDisconnected(); }}>
                        <svg fill="none" height="16" viewBox="0 0 18 16" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z" fill="currentColor"></path></svg>
                            <div className={classes.width}>
                                Disconnect wallet
                            </div>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={'dark'}
                transition={Flip}
            />
        </>
    );
}

export default AccountDialog;