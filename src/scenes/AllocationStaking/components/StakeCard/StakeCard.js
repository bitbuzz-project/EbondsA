import React, { useState, useEffect } from 'react';
import classes from './StakeCard.module.scss';
import StakeIcon from './images/StakeIcon.svg';
import { abi, stakingContractAddress } from './../../services/consts';
import { abi as tokenAbi, tokenContractAddress } from './services/consts';
import { BigNumber, ethers, providers} from 'ethers';
import Slider from '@mui/material/Slider';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance, setDecimal, selectAddress } from './../../../../features/userWalletSlice'
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { RpcProvider } from '../../../../consts/rpc';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';


const IOSSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#0AA7F5' : '#0AA7F5',
    height: 6,
    padding: '15px 0',

    '& .MuiSlider-thumb': {
        backgroundColor: '#e29f59',
        border: '3px solid white',
        boxShadow: iOSBoxShadow,
        '&:focus, &:hover, &.Mui-active': {
            boxShadow:
                '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
    },

    '& .MuiSlider-valueLabel': {
        fontSize: 12,
        fontWeight: '600',
        top: 41,
        backgroundColor: 'unset',
        color: theme.palette.text.primary,
        '&:before': {
            display: 'none',
        },
        '& *': {
            background: 'transparent',
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgb(191, 191, 191) ;',
        },
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 6
    },
    '& .MuiSlider-rail': {
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
    },
    '& .MuiSlider-mark': {
        backgroundColor: '#bfbfbf',
        height: 10,
        width: 0,
        '&.MuiSlider-markActive': {
            opacity: 0.8,
            backgroundColor: 'currentColor',
        },
    },
}));


const StakeCard = ({ price, update }) => {
    const [isButtonVisible, setButtonVisibility] = useState(true);
  
    const [amount, setAmount] = useState(0);
    let contract;
    const balance = useSelector(state => state.userWallet.balance);
    const decimals = useSelector(state => state.userWallet.decimal);
    const walletAddress = useSelector(selectAddress);
    const [allowance, setAllowance] = useState(0);

    const dispatch = useDispatch();
    const { ethereum } = window;

    const updateBalance = async () => {
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner();
            let contract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
            let tdecimals = await contract.decimals();
            let tbalance = await contract.balanceOf(walletAddress);
            dispatch(setDecimal(tdecimals));
            dispatch(setBalance(parseInt(tbalance.toString())));
        }else if(walletAddress){
            const providerr = new WalletConnectProvider({
                rpc: {
                    42161: RpcProvider
                },
              });
            
            const web3Provider = new providers.Web3Provider(providerr);
            const signer = web3Provider.getSigner();

            let contract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
            let tdecimals = await contract.decimals();
            let tbalance = await contract.balanceOf(walletAddress);
            dispatch(setDecimal(tdecimals));
            dispatch(setBalance(parseInt(tbalance.toString())));
        }
    }

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && walletAddress) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner();
            contract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);

            contract.allowance(walletAddress, stakingContractAddress).then(response => {
                setAllowance(parseInt(response.toString()));
            })
        }else if(walletAddress){
            const providerr = new WalletConnectProvider({
                rpc: {
                    42161: RpcProvider
                },
              });
            
            const web3Provider = new providers.Web3Provider(providerr);
            const signer = web3Provider.getSigner();

            contract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);

            contract.allowance(walletAddress, stakingContractAddress).then(response => {
                setAllowance(parseInt(response.toString()));
            })
        }
    }, [decimals, walletAddress])
   
    useEffect(() => {
        if (amount * (10 ** decimals) > allowance) {
          setButtonVisibility(true);
        } else {
          setButtonVisibility(false);
        }
      }, [amount,decimals, allowance]);
    const stakeFunction = async () => {
        
        if (amount * (10 ** decimals) < allowance) {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner();
                contract = new ethers.Contract(stakingContractAddress, abi, signer);

                let bigAmount = BigNumber.from(Math.round(amount * 100)).mul(BigNumber.from(10).pow(decimals - 2));
                const res = await contract.deposit(bigAmount);

                const a = res.wait().then(() => {
                    const promise = new Promise(async (resolve, reject) => {
                        setAmount(0);
                        await update();
                        await updateBalance();
                        resolve(1);
                    })

                    toast.promise(
                        promise,
                        {
                            pending: 'Updating information, please wait...',
                            success: {
                                render() {
                                    return "Data updated"
                                },
                                autoClose: 1
                            }
                        }
                    );
                });

                toast.promise(
                    a,
                    {
                        pending: 'Transaction pending',
                        success: 'Transaction successful',
                        error: 'Transaction failed'
                    }
                )
            }
            else if(walletAddress){
                const providerr = new WalletConnectProvider({
                    rpc: {
                        42161: RpcProvider
                    },
                  });
                
                const web3Provider = new providers.Web3Provider(providerr);
                const signer = web3Provider.getSigner();
                contract = new ethers.Contract(stakingContractAddress, abi, signer);

                let bigAmount = BigNumber.from(Math.round(amount * 100)).mul(BigNumber.from(10).pow(decimals - 2));
                const res = await contract.deposit(bigAmount);

                const a = res.wait().then(() => {
                    const promise = new Promise(async (resolve, reject) => {
                        setAmount(0);
                        await update();
                        await updateBalance();
                        resolve(1);
                    })

                    toast.promise(
                        promise,
                        {
                            pending: 'Updating information, please wait...',
                            success: {
                                render() {
                                    return "Data updated"
                                },
                                autoClose: 1
                            }
                        }
                    );
                });

                toast.promise(
                    a,
                    {
                        pending: 'Transaction pending',
                        success: 'Transaction successful',
                        error: 'Transaction failed'
                    }
                )
            }
        }
        else {
            const { ethereum } = window;
            if (ethereum) {
                const { ethereum } = window;
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner();
                const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
                tokenContract.approve(stakingContractAddress, ethers.constants.MaxUint256).then((res) => {

                    let tran = res.wait().then((transaction) => {
                        setAllowance(ethers.constants.MaxUint256);
                    });

                    toast.promise(
                        tran,
                        {
                            pending: 'Approval pending',
                            success: 'Approval successful',
                            error: 'Approval ailed'
                        }
                    );
                });
            }
            else if(walletAddress){
                const providerr = new WalletConnectProvider({
                    rpc: {
                        42161: RpcProvider
                    },
                  });
                
                const web3Provider = new providers.Web3Provider(providerr);
                const signer = web3Provider.getSigner();
           
                const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
                tokenContract.approve(stakingContractAddress, ethers.constants.MaxUint256).then((res) => {

                    let tran = res.wait().then((transaction) => {
                        setAllowance(ethers.constants.MaxUint256);
                    });

                    toast.promise(
                        tran,
                        {
                            pending: 'Approval pending',
                            success: 'Approval successful',
                            error: 'Approval ailed'
                        }
                    );
                });
            }
        }
    }

    return (<>
    
        <div className={classes.stakeCard}>

            <div className={classes.cardContent}>

                <div className={classes.cardHeader}>
                    {/* <img className={classes.headerIcon} src={StakeIcon} /> */}
                    <div className={classes.headerText}>
                        Stake EBONDS
                    </div>
                </div>
                <div className={classes.input}>
                    <div className={classes.inputHeader}>
                        <div className={classes.headerBalance}> You’re staking </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
  <b className={classes.headerBalance} style={{ marginRight: '10px' }}>balance: {(balance / Math.pow(10, decimals)).toFixed(2)}</b>
  <button
  className={classes.headerMax}
  onClick={() => {
    const roundedBalance = (balance / Math.pow(10, decimals)).toFixed(2);
    setAmount(roundedBalance);
  }}
>
  MAX
</button>

</div>

</div>
                    <div className={classes.inputFields}>
                    <input
    type="number"
    value={amount === 0 ? '' : amount}
    min={0}
    max={balance / Math.pow(10, decimals)}
    step="0.01"  // Set step to 0.01 to allow increments of 0.01
    className={classes.inputField}
    onChange={(e) => {
        const inputValue = e.target.value;
        let roundedValue = 0;

        if (inputValue !== "") {
            // Round to two decimal places
            roundedValue = parseFloat(parseFloat(inputValue).toFixed(2));
        }

        setAmount(roundedValue);
    }}
/>

</div>


                    {/* <IOSSlider
                        className={classes.percentSlider}
                        value={Math.round(amount / (balance / Math.pow(10, decimals)) * 100)}
                        aria-label="Default"
                        valueLabelDisplay="on"
                        onChange={(e, value) => {
                            setAmount(parseFloat(((balance / Math.pow(10, decimals)) / 100 * value).toFixed(2)))
                        }}
                        marks={[{ value: 0 }, { value: 100 }]}
                        valueLabelFormat={(value) => isNaN(value) ? '' : value + '%'}
                    /> */}
                </div>
                        


                <div className={classes.confirmationButton}>
                {isButtonVisible && (
  <button
    className={`${classes.sideBySideButton}`}
    onClick={() => {
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
          // Automatically trigger network change when unsupported chain ID error occurs
      changeNetwork();
      if (amount === 0) {
        toast.error("Amount must be greater than zero.");
      } else {
        stakeFunction();
      }
    }}
  >
    
    Approve EBONDS
  </button>
)}

<button
  className={`${classes.sideBySideButton} ${isButtonVisible ? '' : classes.disabled}`}
  onClick={() => {
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
      // Automatically trigger network change when unsupported chain ID error occurs
      changeNetwork();
    if (amount === 0) {
      toast.error("Amount must be greater than zero.");
    } else if(amount > balance / Math.pow(10, decimals)) {
        toast.error("You have insufficient EBONDS");
    } else {
        stakeFunction(); 
    }
  }}
  disabled={isButtonVisible}
>
  Stake
</button>
</div>


            </div>
        </div>

    </>
    );
}

export default StakeCard;