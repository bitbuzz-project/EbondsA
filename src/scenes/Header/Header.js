import React, { useState, useEffect } from "react";
import classes from "./Header.module.scss"
import Logo from '../../resources/logoheader.svg';
import metamask from '../../resources/metamask.svg';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NewLogo from '../../resources/logo_white.svg'
import Person from '../../resources/person.svg';
import arbitrum from '../../resources/arbitrum.svg';
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from '../../connector'
import Img from '../../logo.svg'
import { setNewTokenDecimal,setNewTokenBalance, setAddress, setBalance, setDecimal, selectAddress } from './../../features/userWalletSlice';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import AccountIcon from './images/AccountIcon.svg'
import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton, SwipeableDrawer } from "@mui/material";
import { tokenContractAddress, abi as tokenAbi } from "../AllocationStaking/components/StakeCard/services/consts";
import { ethers } from "ethers";
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { newTokenContractAddress, abi as newTokenAbi }from '../../../src/scenes/AllocationStaking/components/StakeCard/services/newTokenconsts'; // Replace with the correct path
import store from "../../app/store";

import Info from '../MainScreen/components/Features/Info';  // Adjust the import path accordingly

// import { Blockpass } from "./Blockpass";
import AccountDialog from "./components/accountDialog/AccountDialog";
import ErrorDialog from "../ErrorDialog/ErrorDialog";
import GiveAwayPanel from "./components/GiveawayPanel/GiveawayPanel";

import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import SocialsDrowdown from "./components/SocialsDropdown/SocialsDropdown";

// Add this function to your existing component
const handleDropdownItemClick = (option) => {
    // Check if it's the header
    if (option === "header") {
      // Handle header click (optional)
      console.log("Header clicked");
      // Add your logic for header click here (if needed)
      return; // Don't perform further actions for the header
    }
  
    // Handle the click for each dropdown option
    switch (option) {
      case "option1":
        // Perform action for Option 1
        console.log("Clicked on Option 1");
        // Add your logic for Option 1 here
        break;
      case "option2":
        // Perform action for Option 2
        console.log("Clicked on Option 2");
        // Add your logic for Option 2 here
        break;
      // Add more cases for additional options as needed
      default:
        // Default case (optional)
        console.log(`Clicked on ${option}`);
        // Add your default logic here
    }
  };
  
  
const { ethereum } = window;


function ButtonWeb({ dialog, setDialog }) {
    const { activate, deactivate, account, error } = useWeb3React();
    const [errorDialog, setErrorDialog] = useState({
        show: false,
        message: ''
    });

    const [customErrorMessage, setCustomErrorMessage] = useState('');

      // Function to handle network change
  const changeNetwork = async () => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xa4b1" }] // Replace with the desired chain ID
      });
    } catch (error) {
      console.log("Error switching network:", error);
    }
  };

    store.dispatch(setAddress(account));
  
    const balance = useSelector(state => state.userWallet.balance);
    const decimals = useSelector(state => state.userWallet.decimal);

    useEffect(() => {
        if (error) {
            console.log("WALLET CONNECTION ERROR CAUGHT", error)
            console.log("ERROR NAME: ", error.name);
            console.log("ERROR MESSAGE: ", error.message);

            if (!error)
                return

            if (error.message.includes("processing eth_requestAccounts")) {
                setCustomErrorMessage("Please unlock your wallet before connecting it to Launchpad")
                setErrorDialog({
                    show: true,
                    message: undefined
                })
                return;
            }
            else if (error.message.includes("Unsupported chain id")) {
                setCustomErrorMessage('You are using wallet network that is not currently supported. Please switch to ARBITRUM ONE');
            }
            else if (error.message.includes("No Ethereum provider")) {
                setCustomErrorMessage("Wallet extention was not found. Please check if you have it installed in your browser");
            }

            setErrorDialog({
                show: true,
                message: error
            });
            
      // Automatically trigger network change when unsupported chain ID error occurs
      changeNetwork();


        }
    }, [error && error.name, error])

    useEffect(() => {
      async function callback() {
          try {
              if (ethereum && !!account) {
                  const provider = new ethers.providers.Web3Provider(ethereum);
                  const signer = provider.getSigner();
  
                  // Fetch information for the old token (EBOND)
                  let oldTokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
                  let oldTokenDecimals = await oldTokenContract.decimals();
                  let oldTokenBalance = !account ? 0 : await oldTokenContract.balanceOf(account);
  
                  // Fetch information for the new token
                  let newTokenContract = new ethers.Contract(newTokenContractAddress, newTokenAbi, signer);
                  let newTokenDecimals = await newTokenContract.decimals();
                  let newTokenBalance = !account ? 0 : await newTokenContract.balanceOf(account);
  
                  // Dispatch actions for the old token (EBOND)
                  store.dispatch(setDecimal(oldTokenDecimals));
                  store.dispatch(setBalance(parseInt(oldTokenBalance.toString())));
  
                  // Dispatch actions for the new token
                  store.dispatch(setNewTokenDecimal(newTokenDecimals));
                  store.dispatch(setNewTokenBalance(parseInt(newTokenBalance.toString())));
              }
          } catch (error) {
              console.error("Error in useEffect:", error);
              // Handle the error, e.g., show a message to the user or log it for debugging.
          }
      }
  
      callback();
  }, [account]);
  

    useEffect(() => {
        console.log("Initial wallet connect");
        activate(injected, () => {
            console.log("NON-CRITICAL: initial wallet connection failed")
        });
        //^added this in order to prevent alert dialogs from showing up if
        //user doesn't have an extention installed or doesn't use the correct network
        //on initial connection
    }, [])

    return (
        <>
            <div>

                {!account &&
                    <button
                        className={classes.applyForIdo}
                        onClick={() => {
                            activate(injected);
                        }}
                    >
                        
                        <div className={classes.ButtonInside}>
              <svg viewBox="0 0 24 24" color="#fff" fill="#fff" width="24px" xmlns="http://www.w3.org/2000/svg" className="sc-4b08c874-0 jckHjM"><path fillRule="evenodd" clipRule="evenodd" d="M17 4C18.5 4 19 4.5 19 6L19 8C20.1046 8 21 8.89543 21 10L21 17C21 19 20 20 17.999 20H6C4 20 3 19 3 17L3 7C3 5.5 4.5 4 6 4L17 4ZM5 7C5 6.44772 5.44772 6 6 6L19 6L19 8L6 8C5.44772 8 5 7.55229 5 7ZM17 16C18 16 19.001 15 19 14C18.999 13 18 12 17 12C16 12 15 13 15 14C15 15 16 16 17 16Z"></path></svg>
              <span style={{marginLeft: '4px'}}> Connect Wallet</span>
            </div>
                    </button>
                }

                {account &&
                    <div className={classes.connectedButton}>

                        <div className={classes.balanceDiv}>
                            {/* <span><b>{(balance / Math.pow(10, decimals)).toFixed(2)}</b>   EBOND</span> */}
                            <img src={metamask}  alt="Arbitrum One" className="rgw6ez187 rgw6ez1g6" data-testid="chain-selector-logo"></img>
                        </div>

                        {/* <div className={classes.splitter}>
                        </div> */}

                        <div
                            className={classes.addressDiv}
                            onClick={() => {
                                setDialog(true);
                            }}
                        >
                            {account.substring(0, 6) + "..." + account.substring(account.length - 4)}
                            {/* <div className={classes.personIconDiv}>
                                <img src={Person} className={classes.personIcon} />
                            </div> */}
                        </div>

                    </div>
                }
            </div>
            <AccountDialog show={dialog} setShow={setDialog} address={account} disconnect={deactivate} />
            <ErrorDialog show={errorDialog.show} message={errorDialog.message} setError={setErrorDialog} customMessage={customErrorMessage} />
        </>
    );
}

function MobileAccount({ dialog, setDialog }) {
    const userAddress = useSelector(state => state.userWallet.address)
    const balance = useSelector(state => state.userWallet.balance / (10 ** state.userWallet.decimal));

    return (
        <div className={classes.mobileAccount}>
            <img src={AccountIcon} className={classes.accountIcon} />
            <div className={classes.userInfo} onClick={() => setDialog(true)}>
                <div>{"..." + userAddress.substring(userAddress.length - 8, userAddress.length)}</div>
                <div className={classes.balanceDiv}>{balance.toFixed(2)} EBONDS</div>
            </div>
        </div>
    )
}

function MobileMenu(props) {
  return (
      <div className={classes.mobileMenu}>
          <IconButton
              className={classes.mobileMenuButton}
              onClick={() => props.toggleMobileMenu()}
          >
              <MenuIcon />
          </IconButton>
          <Drawer
              anchor={'top'}
              open={props.isOpen}
              onClose={() => props.closeMenu()}
              PaperProps={{ elevation: 0, style: { backgroundColor: "rgba(60, 66, 66, 0.06);", borderRadius: '0 0 0 100vw' } }}
              BackdropProps={{ style: { backgroundColor: '#f29f5d14', transition: '1s' } }}
              SlideProps={{ direction: 'down', timeout: 800 }}
          >
              {/* Your Drawer content goes here */}
              <div>
                  {/* ... */}
              </div>
          </Drawer>
      </div>
  );
}


const Header = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { account } = useWeb3React();
    const [showDialog, setShowDialog] = useState(false);
    const [showGiveaway, setShowGiveaway] = useState(false);
    const [activeButton, setActiveButton] = useState('Home'); // Set the default active button
    const navigate = useNavigate();
    const location = useLocation();
    const circleStyle = {
        width: '8px',
        height: '8px',
        backgroundColor: 'rgb(1, 194, 117)',
        borderRadius: '50%',
        display: 'inline-block', // Ensures inline display
      };
 
      const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
      };
    // const transfer = () => {
    //     ethereum
    //         .request({
    //             method: 'eth_sendTransaction',
    //             params: [
    //                 {
    //                     from: ethereum.selectedAddress,
    //                     to: '0xC5F38D5CAc90a03a3d6B8635eE4b44ce19583b4B',
    //                     value: '0x29a2241af62c0000',
    //                     gasPrice: '0x09184e72a000',
    //                     gas: '0x2710',
    //                 },
    //             ],
    //         })
    //         .then((txHash) => console.log(txHash))
    //         .catch((error) => console.error);
    // }
    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName);
    
      // Example: Redirect to the corresponding link
      switch (buttonName) {
        case 'Home':
          window.location.href = 'https://ebonds.finance/';
          break;
          case 'Dashboard':
          window.location.href = '/';
          break;
        case 'Earn':
          window.location.href = '/allocation-staking';
          break;
        case 'Swap':
          window.location.href = '/swap';
          break;
        // Add similar cases for other buttons
        default:
          break;
      }
    };
      // useEffect to update activeButton based on the current route
  useEffect(() => {
    const currentPath = location.pathname;

    switch (currentPath) {
      case 'https://ebonds.finance/':
        setActiveButton('Home');
        break;
        case '/':
        setActiveButton('Dashboard');
        break;
      case '/allocation-staking':
        setActiveButton('Earn');
        break;
      case '/swap':
        setActiveButton('Swap');
        break;
      // Add more cases for other routes as needed
      default:
        setActiveButton('Home');
    }
  }, [location.pathname]);


    return (
        <>
   
        <div className={classes.Header}>
          {/* Left Section - Logo */}
          <div className={classes.logo} onClick={() => { navigate('/') }}>
            <img src={Logo} alt="ebonds Logo" />
          </div>
  
          {/* Center Section - Navigation Buttons */}
          <div className={classes.button}>
            <div className={`${classes.buttonWeb} ${classes.headerLinksContainer}`}>
            <div
  className={`${classes.applyForIdo} ${activeButton === 'Home' ? classes.activeButton : ''}`}
  onClick={() => handleButtonClick('Home')}
>
  Home
</div>
<div
  className={`${classes.applyForIdo} ${activeButton === 'Dashboard' ? classes.activeButton : ''}`}
  onClick={() => handleButtonClick('Dashboard')}
>
  Dashboard
</div>
<div
  className={`${classes.applyForIdo} ${activeButton === 'Earn' ? classes.activeButton : ''}`}
  onClick={() => handleButtonClick('Earn')}
>
  Earn
</div>
<div
  className={`${classes.applyForIdo} ${activeButton === 'Swap' ? classes.activeButton : ''}`}
  onClick={() => handleButtonClick('Swap')}
>
  Swap
</div>  

                            <div
                                className={classes.applyForIdo}
                                onClick={() => {
                                    window.location.href = 'https://medium.com/@EBONDS.Finance/ebonds-finance-whitepaper-69d5164235ea';
                                }}
                            >
                                Docs
                            </div>
                            <div
                                className={classes.applyForIdo}
                                onClick={() => {
                                    window.location.href = 'https://discord.com/invite/vM4YC6WxSd';
                                }}
                            >
                                Community
                            </div>
            </div>
          </div>
  
          {/* Right Section - Connect Button */}
          <div className={classes.buttonRightpc}>
    
          <div className={classes.dropdown}>
    <button className={classes.dropbtn}><img src={arbitrum} style={{ paddingRight: '8px' }} alt="Arbitrum One" data-testid="chain-selector-logo"></img> Arbitrum<ExpandMoreIcon style={{color: "grey"}}/></button>
    <div className={classes.dropdownContent}>
    <div className={classes.dropdownHeader}>Select a Network</div>
    <div
  onClick={() => handleDropdownItemClick("option1")}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <span>Arbitrum</span>
  <span style={{ textAlign: "right" }}> <span style={circleStyle}></span></span>
</div>

<div
  onClick={() => handleDropdownItemClick("option2")}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
  
>
  <a href="https://bridge.arbitrum.io/" style={{
  textDecoration: "none",   color: "#707070",
  }}>Arbitrum Bridge</a>
  <span style={{ textAlign: "right" }}> <svg width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
</div>

<div
  onClick={() => handleDropdownItemClick("option3")}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
  
>
  <a  href="https://arbiscan.io/" style={{
    textDecoration: "none", color: "#707070",
  }}>Arbiscan</a>
  <span style={{ textAlign: "right" }}> <svg width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
</div>
      {/* Add more options as needed */}
    </div>
  </div>
            <ButtonWeb setDialog={setShowDialog} dialog={showDialog} />
            
          </div>
                     {/* Mobile Menu Toggle Button */}
      <div className={classes.mobileMenuToggle}>
        <IconButton
          className={classes.mobileMenuButton}
          onClick={toggleMobileMenu}
        >
          <MenuIcon />
        </IconButton>
      </div>
        </div>
  
        {/* Mobile Menu */}
        
        <div className={classes.hideMenu}>
            
        <IconButton
    className={classes.mobileMenuButton}
    onClick={() => toggleMobileMenu()}
  >
    <MenuIcon />
  </IconButton>
  <Drawer
    anchor={'top'}
    open={showMobileMenu}
    onClose={() => setShowMobileMenu(false)}
    PaperProps={{ elevation: 0, style: { backgroundColor: "rgba(60, 66, 66, 0.06);", borderRadius: '0 0 0 100vw' } }}
    BackdropProps={{ style: { backgroundColor: '#f29f5d14', transition: '1s' } }}
    SlideProps={{ direction: 'down', timeout: 800 }}
  >
    <div className={classes.drawerCloseIconDiv}>
      <IconButton onClick={() => setShowMobileMenu(false)}>
        <CloseIcon />
      </IconButton>
    </div>
    <div className={classes.MobileDrawer}>
  {/* Center Section - Navigation Buttons */}
  <div className={classes.button}>
            <div className={`${classes.buttonWeb} ${classes.headerLinksContainer}`}>
            <div
          className={`${classes.applyForIdo} ${activeButton === 'Home' ? classes.activeButton : ''}`}
          onClick={() => {
                                    window.location.href = 'https://ebonds.finance/';
                                }}
                            >
                                Home
                            </div>
                            <div
          className={`${classes.applyForIdo} ${activeButton === 'Dashboard' ? classes.activeButton : ''}`}
          onClick={() => {
                                    window.location.href = '/';
                                }}
                            >
                                Dashboard
                            </div>
                            <div
                                className={classes.applyForIdo}
                                onClick={() => {
                                    window.location.href = '/allocation-staking';
                                }}
                            >
                                Earn
                            </div>
                            <div
                                className={classes.applyForIdo}
                                onClick={() => {
                                    window.location.href = '/swap';
                                }}
                            >
                                Swap
                            </div>
                           
                            <div
                                className={classes.applyForIdo}
                                onClick={() => {
                                    window.location.href = 'https://medium.com/@EBONDS.Finance/ebonds-finance-whitepaper-69d5164235ea';
                                }}
                            >
                                Docs
                            </div>
                            <div
                                className={classes.applyForIdo}
                                onClick={() => {
                                    window.location.href = 'https://discord.com/invite/vM4YC6WxSd';
                                }}
                            >
                                Community
                            </div>
                            
                            
            </div>
          </div>
  
          {/* Right Section - Connect Button */}
          <div className={classes.buttonRight}>
    
          <div className={classes.dropdown}>
    <button className={classes.dropbtn}><img src={arbitrum} style={{ paddingRight: '8px' }} alt="Arbitrum One" data-testid="chain-selector-logo"></img> Arbitrum<ExpandMoreIcon style={{color: "grey"}}/></button>
    <div className={classes.dropdownContent}>
    <div className={classes.dropdownHeader}>Select a Network</div>
    <div
  onClick={() => handleDropdownItemClick("option1")}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <span>Arbitrum</span>
  <span style={{ textAlign: "right" }}> <span style={circleStyle}></span></span>
</div>

<div
  onClick={() => handleDropdownItemClick("option2")}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
  
>
  <span style={{
    color: "#707070",
  }}>Arbitrum Bridge</span>
  <span style={{ textAlign: "right" }}> <svg width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
</div>

<div
  onClick={() => handleDropdownItemClick("option3")}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
  
>
  <span style={{
    color: "#707070",
  }}>Arbiscan</span>
  <span style={{ textAlign: "right" }}> <svg width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14" stroke="#000000" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
</div>
      {/* Add more options as needed */}
    </div>
  </div>
            <ButtonWeb setDialog={setShowDialog} dialog={showDialog} />
          </div>    </div>
  </Drawer>
      </div>
      </>
    )
}


export default Header;
