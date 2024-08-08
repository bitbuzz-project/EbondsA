import React from 'react';
import svgico from '../../resources/coin-clatter.svg'
import svgebo from '../../resources/eb-clatter.svg'
import { ethers, BigNumber } from 'ethers';
import { fetchUSDTPrice } from '../AdminPanel/API/media'
import classes from './AllocationStaking.module.scss'
import StakeCard from './components/StakeCard/StakeCard';
import StakingStats from './components/StakingStats/StakingStats';
import TotalsSection from './components/TotalsSection/TotalsSection';
import ValuePriceCard from './components/ValuePriceCard/ValuePriceCard';
import EsirPriceCard from './components/EsirPriceCard/EsirPriceCard';
import WithdrawCard from './components/WithdrawCard/WithdrawCard';
import Info from '../../../src/scenes/MainScreen/MainScreen';
import Button from '@mui/material/Button';
import { abi, stakingContractAddress } from './services/consts';
import { abi as tokenAbi, tokenContractAddress } from './components/StakeCard/services/consts';

import { selectAddress, setDecimal } from './../../features/userWalletSlice';
import { useDispatch, useSelector } from 'react-redux';

import { useState, useEffect } from 'react'
import InfoDialog from './components/InfoDialog/InfoDialog';
import { setBalance } from '../../features/stakingSlice';
import { toast } from 'react-toastify';
import { getPrice } from './API/staking';
import { RpcProvider } from '../../consts/rpc';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import { fetchEbPrice } from '../AdminPanel/API/Ebmedia';
import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + 'K';
    } else if (num > 1000000 && num < 10 ** 9) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num > 10 ** 9) {
      return (num / 10 ** 9).toFixed(2) + 'B';
    } else if (num < 900) {
      return num.toFixed(2);
    }
  }
const AllocationStaking = () => {
    const [stakingPercent, setStakingPercent] = useState(undefined);
    const [claimedRewards, setClaimedRewards] = useState(0);
    const [pendingrewards, setpendingrewards] = useState(0);
    const [totalclaimed, settotalclaimed] = useState(0);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [activeTab, setActiveTab] = useState('buy'); // Default active tab is 'buy'
    const handleTabChange = (tab) => {
        setActiveTab(tab);
      };
    
    const dispatch = useDispatch();
    const decimals = useSelector(state => state.userWallet.decimal);

    const mainText = "Stake EBONDS to get allocation and earn ESIR";
    const [totalValueLocked, setTotalValueLocked] = useState(0);
    const [price, setPrice] = useState(0);
    const [stakeBalance, setStakeBalance] = useState(0);
    const [WithdrawBalance, setWithdrawBalance] = useState(0);
    const [stakingContract, setStakingContract] = useState();
    const balance = useSelector(state => state.userWallet.balance);

    const address = useSelector(state => state.userWallet.address);
    const [stakingStats, setStakingStats] = useState([
        {
            title: 'Current APY',
            value: undefined,
            append: '%',
            info: 'We offer a guaranteed fixed APY of 20%'
        },

        {
            title: 'My staked EBONDS',
            value: undefined,
            append: '',
            info: 'The total number of your PEAK tokens that are currently locked in our staking pool',
            subvalue: {
                value: undefined,
                append: '$'
            }
        },

        {
            title: 'Pending rewards',
            value: undefined,
            append: '',
            info: 'The total number of PEAK tokens you have earned through the staking process',
            subvalue: {
                value: undefined,
                append: '$'
            }
        },
        {
            title: 'Your total rewards claimed',
            value: undefined,
            append: '',
            info: 'The total number of PEAK tokens you have earned through the staking process',
            subvalue: {
                value: undefined,
                append: '$'
            }
        },


    ]);


    const [totals, setTotals] = useState([
        {
            title: 'Total EBONDS Staked',
            info: 'The total amount of PEAK tokens that are staked on our launchpad',
            value: {
                value: 0
            },
            subvalue: {
                value: 0,
                prepend: '$'
            }
        },

        {
            title: 'Total Rewards Distributed',
            info: 'The total amount of PEAK token rewards we distributed to all stakers on our launchpad',
            value: {
                value: 0
            },
            subvalue: {
                value: 0,
                prepend: '$'
            }
        }
    ]);
    const [
    ebondPrice, setebondPrice] = useState(null);
    useEffect(() => {
        fetchUSDTPrice().then((arbPrice) => {
            // Assuming 1 EBONDS = 0.01 USDT, you can adjust this based on your actual conversion rate
            const esirPrice = (arbPrice);
            // Assuming 1 ESIR = 0.02 USDT, you can adjust this based on your actual conversion rate
  
            setesirPrice(esirPrice);
  
            // console.log(eBondPrice);
        });
        fetchEbPrice().then((arbPrice) => {
          // Assuming 1 EBONDS = 0.01 USDT, you can adjust this based on your actual conversion rate
          const eBondPrice = (arbPrice);
          // Assuming 1 ESIR = 0.02 USDT, you can adjust this based on your actual conversion rate
         
          setebondPrice(eBondPrice);
  
          // console.log(eBondPrice);
      });
    }, []);
    

    const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
    const [esirprice, setesirPrice] = useState(null);

    useEffect(() => {
        fetchUSDTPrice().then((arbPrice) => {
   
            // Assuming 1 ESIR = 0.02 USDT, you can adjust this based on your actual conversion rate
            const esirPrice = (arbPrice);
            setesirPrice(esirPrice);

            // console.log(eBondPrice);
        });
    }, []);

    async function getInfo() {
        const { ethereum } = window;
        if (ethereum && address) {
            const localStakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
            setStakingContract(localStakingContract);

            if(!localStakingContract)
                return

            console.log(localStakingContract);
            const totalDepositsP = localStakingContract.totalDeposits().then(response => {
                let tempTotals = [...totals];
                tempTotals[0].value.value = parseInt(response.toString());
                tempTotals[0].subvalue.value = response * ebondPrice;

                setTotalValueLocked(ebondPrice * (response / Math.pow(10, decimals)))
                setTotals([...tempTotals]);
            });

            const paidOut = localStakingContract.paidOut().then(response => {
                let tempTotals = [...totals];
                tempTotals[1].value.value = response;
                tempTotals[1].subvalue.value = response * esirprice;
                setTotals([...tempTotals]);

                settotalclaimed(tempTotals[1].value.value = response / Math.pow(10, decimals));
            });

            //My Earned PEAKDEFI(2) && My Staked PEAKDEFI(1)
            const userInfoP = localStakingContract.userInfo(address).then(response => {
                let tempStakingStats = [...stakingStats];
                console.log(response.amount)
                tempStakingStats[1].value = response.amount ;
                tempStakingStats[1].subvalue.value = response.amount * ebondPrice;

                setStakingStats([...tempStakingStats]);

                setStakeBalance(parseInt(response.amount.toString()));

                //updating staking balance globally
                dispatch(setBalance(parseInt(response.amount.toString())));
            });



           //current APY
        const stakingPercentP = localStakingContract.totalDeposits().then((response) => {
            const Esireprice = esirprice; // replace with the actual value of Esireprice
            const stakingPercent = ((((1 + (Esireprice / (0.865*1000))) ** 365) - 1) * 100).toFixed(2);

            setStakingPercent(stakingPercent);
            
            let tempStakingStats = [...stakingStats];
            tempStakingStats[0].value = stakingPercent;
            setStakingStats([...tempStakingStats]);
        })

            const lprovider = new ethers.providers.Web3Provider(ethereum)
            const signer = lprovider.getSigner();
            const tstakingContract = new ethers.Contract(stakingContractAddress, abi, signer)
             let pendingP;
          // Define a variable to track if it's the first execution
let isFirstExecution = true;

// Create a function to execute the code
const executeCode = () => {
  pendingP = tstakingContract.pending().then(response => {
    let tempStakingStats = [...stakingStats];
    tempStakingStats[2].value = response;
    tempStakingStats[2].subvalue.value = response * esirprice;
    setStakingStats([...tempStakingStats]);
    console.log(tempStakingStats[2].value.toString(10));
  });
};


// Execute the code immediately
executeCode();

// Set interval to execute the code every 30 seconds
setInterval(() => {
  // Execute the code after the first refresh
  if (!isFirstExecution) {
    executeCode();
  }
  
  // Update the flag to indicate subsequent executions
  isFirstExecution = false;
}, 30000);
            // const pendingP = tstakingContract.pending().then(response => {
            //     let tempStakingStats = [...stakingStats];
            //     tempStakingStats[2].value = response;
            //     tempStakingStats[2].subvalue.value = (response * esirprice);
            //     setStakingStats([...tempStakingStats]);
            //     console.log(tempStakingStats[2].value.toString(10));
            // });

                const userInfoW = localStakingContract.userInfo(address).then(response => {
                let tempStakingStats = [...stakingStats];
                console.log(response.totalwithdraw)
                tempStakingStats[3].value = response.totalwithdraw ;
                tempStakingStats[3].subvalue.value = response.totalwithdraw * esirprice;

                setStakingStats([...tempStakingStats]);

                // setWithdrawBalance(parseInt(response.totalwithdraw.toString()));

                //updating staking balance globally
                // dispatch(setBalance(parseInt(response.totalwithdraw.toString())));
                 setClaimedRewards(tempStakingStats[3].value.toString(10)/ Math.pow(10, decimals));
                 setpendingrewards(tempStakingStats[2].value.toString(10)/ Math.pow(10, decimals));

              
                });
            

          
            return Promise.all([totalDepositsP, paidOut,userInfoW, userInfoP,  stakingPercentP, pendingP])
           
        }
        //for mobile version(Wallet connect)
        else if(address){
            const localStakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
            setStakingContract(localStakingContract);

            if(!localStakingContract)
                return


            console.log(localStakingContract);
            const totalDepositsP = localStakingContract.totalDeposits().then(response => {
                let tempTotals = [...totals];
                tempTotals[0].value.value = parseInt(response.toString());
                tempTotals[0].subvalue.value = response * price;
                setTotalValueLocked(price * (response / Math.pow(10, decimals)))
                setTotals([...tempTotals]);
             

            });

            const paidOut = localStakingContract.paidOut().then(response => {
                let tempTotals = [...totals];
                tempTotals[1].value.value = response;
                tempTotals[1].subvalue.value = response * price;
                setTotals([...tempTotals]);
            });

            //My Earned PEAKDEFI(2) && My Staked PEAKDEFI(1)
            const userInfoP = localStakingContract.userInfo(address).then(response => {
                let tempStakingStats = [...stakingStats];

                tempStakingStats[1].value = response.amount;
                tempStakingStats[1].subvalue.value = response.amount * price;

                setStakingStats([...tempStakingStats]);

                setStakeBalance(parseInt(response.amount.toString()));

                //updating staking balance globally
                dispatch(setBalance(parseInt(response.amount.toString())));
            });



            //current APY
            const stakingPercentP = localStakingContract.totalDeposits().then((response) => {
                const Esireprice = esirprice; // replace with the actual value of Esireprice
                const stakingPercent = ((((1 + (Esireprice / (ebondPrice*1000))) ** 365) - 1) * 100) * Math.pow(10, decimals);

                
                let tempStakingStats = [...stakingStats];
                tempStakingStats[0].value = stakingPercent;
                setStakingStats([...tempStakingStats]);
                console.log(tempStakingStats[0].value);
                
            })

            const providerr = new WalletConnectProvider({
                rpc: {
                    42161: RpcProvider
                },
              });
            
            const web3Provider = new providers.Web3Provider(providerr);
            const signer = web3Provider.getSigner();
            debugger;
        
            const tstakingContract = new ethers.Contract(stakingContractAddress, abi, signer)
            const pendingP = tstakingContract.pending().then(response => {
                let tempStakingStats = [...stakingStats];
                tempStakingStats[2].value = response;
                tempStakingStats[2].subvalue.value = (response * price);
                setStakingStats([...tempStakingStats]);
                
            });


            
            return Promise.all([totalDepositsP, paidOut, userInfoP, stakingPercentP, pendingP])
          
      
        }
        else if(!address){
            const localStakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
            setStakingContract(localStakingContract);

            if(!localStakingContract)
                return


            console.log(localStakingContract);
            const totalDepositsP = localStakingContract.totalDeposits().then(response => {
                let tempTotals = [...totals];
                tempTotals[0].value.value = parseInt(response.toString());
                tempTotals[0].subvalue.value = response * price;

                setTotalValueLocked(price * (response / Math.pow(10, decimals)))
                setTotals([...tempTotals]);
            });

            const paidOut = localStakingContract.paidOut().then(response => {
                let tempTotals = [...totals];
                tempTotals[1].value.value = response;
                tempTotals[1].subvalue.value = response * price;
                setTotals([...tempTotals]);
            });
        }
    }

    async function getPartialInfo() {
        //setStakingContract(localStakingContract);
        const { ethereum } = window;
        if (ethereum) {
            const localStakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
            
            if(!localStakingContract)
                return;

            console.log(totals);
            const totalDepositsP = localStakingContract.totalDeposits().then(response => {
                let tempTotals = [...totals];
                tempTotals[0].value.value = response;
                tempTotals[0].subvalue.value = response * price;
                setTotals([...tempTotals]);
            });

            const paidOut = localStakingContract.paidOut().then(response => {
                let tempTotals = [...totals];
                tempTotals[1].value.value = response;
                tempTotals[1].subvalue.value = response * price;
                setTotals([...tempTotals]);
            });


            return Promise.all([totalDepositsP, paidOut])
        }
    }

    useEffect(() => {
        // getPrice().then(response => setPrice(response.data.price));
        getPartialInfo();
        getInfo();
        if (address) {
            toast.promise(
                getInfo(),
                {
                    pending: 'Fetching data, please wait...',
                    success: {
                        render() {
                            return "Data updated"
                        },
                        autoClose: 1
                    }
                }
            );
        }
    }, [address, price, decimals]);


    useEffect(() => {

        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            let contract = new ethers.Contract(tokenContractAddress, tokenAbi, provider);
            contract.decimals().then(response => {
                dispatch(setDecimal(response));
            })

        }


        // setInterval(() => {
            
        //     const { ethereum } = window;
        //     if(!ethereum)
        //         return;
            
        //     const lprovider = new ethers.providers.Web3Provider(ethereum)


        //     const tstakingContract = new ethers.Contract(stakingContractAddress, abi, lprovider)
        //     tstakingContract.pending().then(response => {
        //         let tempStakingStats = [...stakingStats];
        //         tempStakingStats[2].value = response;
        //         tempStakingStats[2].subvalue.value = response * price;
        //         setStakingStats([...tempStakingStats]);
        //     })
        // }, 30000)
    }, []);


   
    return (
        <div className={classes.allocationStaking}>

<div className={classes.pageTitle}>
  <div className={classes.mainText}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{mainText}</span>
      <Tooltip title="Simply stake your PEAK tokens to earn 20% APY and receive IDO pool allocations for our upcoming projects.">
        <InfoIcon />
      </Tooltip>
    </div>
  </div>

 
</div>
<div className={classes.vpCardblack}>
  <div className={classes.row}>
    {/* First three data items */}

    <div className={classes.dataItem}><div className={classes.dataTitle}>
        
    <img src={svgebo} style={{ width:'34px', paddingRight: '8px' }} alt="EBONDS" data-testid="chain-selector-logo"></img> 
    
    </div>Buy EBONDS</div>
        <div className={classes.dataItem}><div className={classes.dataTitle}><svg xmlns="http://www.w3.org/2000/svg" fill="#504e4e" width="30px" height="30px" viewBox="0 0 24 24" stroke="#504e4e"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19.6 21H4.4C3.1 21 2 19.9 2 18.6V14h2v4.2c0 .6.4.8 1 .8h14c.6 0 1-.4 1-1v-4h2v4.6c0 1.3-1.1 2.4-2.4 2.4z"></path><path d="M15.3 12.1L13.4 14v-4c0-2 0-4.9 2.4-7-3.4.6-5.1 3.2-5.2 7v4l-1.9-1.9L7 13l5 5 5-5-1.7-.9z"></path></g></svg></div>Stake EBONDS </div>

<div className={classes.dataItem}><div className={classes.dataTitle}>
<img src={svgico} style={{ width:'30px', paddingRight: '8px', paddingTop: '2px' }} alt="ESIR" data-testid="chain-selector-logo"></img>    </div>Earn ESIR</div>        
  </div>

  {/* Gap between rows */}
  <div style={{ marginBottom: '10px', paddingLeft: '30px' }} />

  <div className={classes.row}>
    {/* Fourth data item */}
    <div className={classes.dataItem}>    <div className={classes.dataItem}><div className={classes.dataTitle}>  <svg fill="black" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="black">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <g id="Badge_Dollar" data-name="Badge Dollar">
                            <g>
                                <path d="M12,21.953c-.895,0-1.545-.743-2.118-1.4a3.671,3.671,0,0,0-1.033-.946,3.8,3.8,0,0,0-1.466-.077,3.012,3.012,0,0,1-2.421-.494,3.014,3.014,0,0,1-.494-2.421,3.82,3.82,0,0,0-.077-1.466,3.671,3.671,0,0,0-.946-1.033c-.655-.573-1.4-1.222-1.4-2.118s.743-1.545,1.4-2.118a3.66,3.66,0,0,0,.946-1.034,3.815,3.815,0,0,0,.077-1.465,3.012,3.012,0,0,1,.494-2.421,3.015,3.015,0,0,1,2.422-.5A3.794,3.794,0,0,0,8.849,4.39a3.666,3.666,0,0,0,1.033-.945c.573-.655,1.223-1.4,2.118-1.4s1.545.742,2.118,1.4a3.66,3.66,0,0,0,1.034.946,3.807,3.807,0,0,0,1.464.077,3.018,3.018,0,0,1,2.422.5,3.012,3.012,0,0,1,.5,2.422,3.81,3.81,0,0,0,.077,1.464,3.66,3.66,0,0,0,.946,1.034c.655.573,1.4,1.223,1.4,2.118s-.743,1.545-1.4,2.118a3.666,3.666,0,0,0-.945,1.033,3.815,3.815,0,0,0-.077,1.465,3.012,3.012,0,0,1-.5,2.422,3.018,3.018,0,0,1-2.421.494,3.818,3.818,0,0,0-1.465.077,3.673,3.673,0,0,0-1.034.946C13.545,21.21,12.9,21.953,12,21.953ZM8.093,18.5a2.952,2.952,0,0,1,1.138.183,4.233,4.233,0,0,1,1.4,1.21c.454.52.924,1.057,1.365,1.057s.911-.537,1.366-1.057a4.225,4.225,0,0,1,1.4-1.21,4.365,4.365,0,0,1,1.908-.152c.672.041,1.366.085,1.653-.2s.245-.982.2-1.653a4.387,4.387,0,0,1,.152-1.909,4.241,4.241,0,0,1,1.209-1.4c.52-.454,1.057-.924,1.057-1.365s-.537-.911-1.057-1.365a4.234,4.234,0,0,1-1.209-1.4,4.381,4.381,0,0,1-.152-1.908c.041-.671,.084-1.365-.2-1.653s-.982-.246-1.653-.2a4.384,4.384,0,0,1-1.908-.152,4.234,4.234,0,0,1-1.4-1.209c-.454-.52-.924-1.057-1.365-1.057s-.911.537-1.365,1.057a4.241,4.241,0,0,1-1.21,1.4,4.378,4.378,0,0,1-.152,1.91c-.041.672-.084,1.366,.2,1.653s.98.245,1.653.2C7.578,18.519,7.838,18.5,8.093,18.5Z"></path>
                                <path d="M14.5,13.5a2.006,2.006,0,0,1-2,2v1.01A.5.5,0,0,1,12,17a.492.492,0,0,1-.5-.49V15.5h-1.25a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5H12.5a1,1,0,1,0,0-2h-1a2,2,0,0,1,0-4V7.453A.473.473,0,0,1,12,7a.48.48,0,0,1,.5.45V8.5h1.25a.5.5,0,0,1,.5.5.508.508,0,0,1-.5.5H11.5a1,1,0,0,0,0,2h1A2,2,0,0,1,14.5,13.5Z"></path>
                            </g>
                        </g>
                    </g>
                </svg></div>Sell Rewards</div>
 </div>
  </div>

</div>
  
             {/* Your existing .vpCard for centering */}
             <div className={classes.vpCard}>
  <div className={classes.row}>
    {/* First three data items */}

    <div className={classes.dataItem}><div className={classes.dataTitle}>Total staked:</div>${numFormatter(totalValueLocked)}</div>
    <div className={classes.dataItem}><div className={classes.dataTitle}>Current APY:</div>{stakingPercent }%</div>
    <div className={classes.dataItem}><div className={classes.dataTitle}>ESIR price:</div>${esirprice}</div>
    <div className={classes.dataItem}><div className={classes.dataTitle}>Rewards Distributed:</div>{numFormatter(totalclaimed)} ESIR</div>

    
  </div>

  {/* Gap between rows */}
  <div style={{ marginBottom: '10px', paddingLeft: '30px' }} />

  <div className={classes.row}>
    {/* Fourth data item */}
    <div className={classes.dataItem}> <div className={classes.infoButton} onClick={() => { setShowInfoDialog(true); }}>
    Info
  </div></div>
  </div>
</div>


<div className={classes.vpCardstake}>
    
 
  <StakeCard price={price} update={getInfo} />
  
  <div className={classes.row}>
    {/* First three data items */}

    <div className={classes.dataItem}><div className={classes.dataTitle}>Avalaible EBONDS:</div>{(balance / Math.pow(10, decimals)).toFixed(2)}</div>
    <div className={classes.dataItem}><div className={classes.dataTitle}>Staked EBONDS:</div>{stakeBalance  / Math.pow(10, decimals)} EBONDS </div>
    <div className={classes.dataItem}><div className={classes.dataTitle}>EBONDS price:</div>${ebondPrice}</div>
  </div>
</div>

<div className={classes.vpCarwithdraw}>
    
 
  <WithdrawCard balance={stakeBalance} price={ebondPrice} decimals={decimals} update={getInfo}/>
  
  <div className={classes.row}>
    {/* First three data items */}

    <div className={classes.dataItem}><div className={classes.dataTitle}>Pending rewards:</div>{pendingrewards.toFixed(4)} ESIR </div>
    <div className={classes.dataItem}><div className={classes.dataTitle}>Total claimed:</div>{claimedRewards.toFixed(2)} ESIR</div>
  </div>
</div>
            {/* <div className={classes.valuePriceCardContainer}>
        <div className={classes.vpCard}>
            
        </div>
        <div className={classes.vpCard}>
            <ValuePriceCard totalValueLocked={totalValueLocked} price={price} />
        </div>
    </div> */}

            <div className={classes.pageContent}>

    

            </div>
            <InfoDialog show={showInfoDialog} setShow={setShowInfoDialog} />
        </div>
    );
}

export default AllocationStaking;
