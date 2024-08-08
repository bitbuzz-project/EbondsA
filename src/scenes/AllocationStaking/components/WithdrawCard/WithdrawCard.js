import { useState, useRef, useEffect } from 'react';
import WithdrawIcon from './images/WithdrawIcon.svg'
import classes from './WithdrawCard.module.scss'
import { abi, stakingContractAddress } from './../../services/consts'
import { ethers, BigNumber, providers } from 'ethers';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { tokenContractAddress, abi as tokenAbi } from './../StakeCard/services/consts';
import { setBalance, setDecimal, selectAddress } from './../../../../features/userWalletSlice'
import { RpcProvider } from '../../../../consts/rpc';
import WalletConnectProvider from "@walletconnect/ethereum-provider";


const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';


const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#0AA7F5' : '#0AA7F5',
  height: 6,
  padding: '15px 0',

  '& .MuiSlider-thumb': {
    backgroundColor: '#0AA7F5',
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
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
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


const WithdrawCard = ({ price, decimals, update }) => {
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  let contract;
  const balance = useSelector(state => state.staking.balance);
  const walletAddress = useSelector(state => state.userWallet.address);

  const dispatch = useDispatch();

  useEffect(() => {
    if (amount !== 0 && !isNaN(amount)) {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        let scontract = new ethers.Contract(stakingContractAddress, abi, signer);
        scontract.getWithdrawFee(walletAddress, BigNumber.from(Math.round(amount * 100)).mul(BigNumber.from(10).pow(decimals - 2))).then((response) => {
          setFee(parseFloat(response.toString()));
          console.log(response);
        })
      }
    }
  }, [amount])

  const updateBalance = async () => {
    const { ethereum } = window;
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

  const withdrawFunction = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      contract = new ethers.Contract(stakingContractAddress, abi, signer);

      let bigAmount = BigNumber.from(Math.round(amount * 100)).mul(BigNumber.from(10).pow(decimals - 2));

      const res = await contract.withdraw(bigAmount);
      const transaction = res.wait().then(async () => {

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
        transaction,
        {
          pending: 'Transaction pending',
          success: 'Withdraw request completed',
          error: 'Transaction failed'
        }
      )
    }else if(walletAddress){
      const providerr = new WalletConnectProvider({
        rpc: {
          42161: RpcProvider
        },
      });

      const web3Provider = new providers.Web3Provider(providerr);
      const signer = web3Provider.getSigner();
      contract = new ethers.Contract(stakingContractAddress, abi, signer);

      let bigAmount = BigNumber.from(Math.round(amount * 100)).mul(BigNumber.from(10).pow(decimals - 2));

      const res = await contract.withdraw(bigAmount);
      const transaction = res.wait().then(async () => {

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
        transaction,
        {
          pending: 'Transaction pending',
          success: 'Withdraw request completed',
          error: 'Transaction failed'
        }
      )
    }
  }

  const harverstFucntion = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      contract = new ethers.Contract(stakingContractAddress, abi, signer);
      await contract.withdraw(0);
    } else if (walletAddress) {
      const providerr = new WalletConnectProvider({
        rpc: {
          42161: RpcProvider
        },
      });

      const web3Provider = new providers.Web3Provider(providerr);
      const signer = web3Provider.getSigner();
      contract = new ethers.Contract(stakingContractAddress, abi, signer);
      await contract.withdraw(0);
    }
  }

  return (<div className={classes.withdrawCard}>


    <div className={classes.cardContent}>
      <div className={classes.cardHeader}>
        {/* <img className={classes.headerIcon} src={WithdrawIcon} /> */}
        <div className={classes.headerText}>
          Unstake EBONDS
        </div>
      </div>

      <div className={classes.input}>
        <div className={classes.inputHeader}>
          <div className={classes.headerBalance}> Balance: <b>{(balance / Math.pow(10, decimals)).toFixed(2)}</b> (~${((balance*(price) / Math.pow(10, decimals))).toFixed(2)})</div>
          <button className={classes.headerMax} onClick={() => setAmount((balance / Math.pow(10, decimals)))}>MAX</button>
        </div>
        <div className={classes.inputFields}>
          <input type="number" value={amount} className={classes.inputField} min={0} max={balance / Math.pow(10, decimals)} onChange={(e) => {
            setAmount(parseFloat(e.target.value));
          }} />
          {/* <input className={classes.inputFieldPostpend} type="text" value={"EBONDS"} disabled /> */}
        </div>
        {amount > 0 && <div className={classes.fee}>
          <p>Fee: {(fee / Math.pow(10, decimals)).toFixed(4)} EBONDS</p>
        </div>}

        {/* <IOSSlider
          valueLabelDisplay="on"
          className={classes.percentSlider}
          value={Math.round(amount / (balance / Math.pow(10, decimals)) * 100)}
          aria-label="Default"
          onChange={(e, value) => {
            setAmount(parseFloat(((balance / Math.pow(10, decimals)) / 100 * value).toFixed(2)))
          }}
          marks={[{ value: 0 }, { value: 100 }]}
          valueLabelFormat={(value) => isNaN(value) ? '' : value + '%'}
        /> */}
      </div>



      <div className={classes.confirmationButton}>
      <button className={classes.withdrawButton} 
       onClick={() => {
        
        if (amount === 0) {
          toast.error("Amount must be greater than zero.");
        } else if(amount > balance / Math.pow(10, decimals)) {
            toast.error("You have insufficient EBONDS");
        }else {
          withdrawFunction(); 
        }
      }}
      
      > Withdraw EBONDS</button>
        <button className={classes.harvestButton} onClick={harverstFucntion}><div className={classes.whiter}><span className={classes.gradientText}>Claim rewards</span></div></button>
      </div>
    </div>
  </div>);
}

export default WithdrawCard;