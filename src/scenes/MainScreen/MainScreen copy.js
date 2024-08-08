import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import Features from "./components/Features/Info";
import { RpcProvider } from '../../../src/consts/rpc';
import { abi, stakingContractAddress } from './services/consts';
import { setBalance } from '../../features/stakingSlice';
import classes from './MainScreen.module.scss';
import { Balance } from "@mui/icons-material";

const MainScreen = () => {

  async function getInfo() {
  
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


    const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
    const [esirprice, setesirPrice] = useState(null);

    useEffect(() => {
        fetchUSDTPrice().then((arbPrice) => {
            // Assuming 1 EBONDS = 0.01 USDT, you can adjust this based on your actual conversion rate
            const eBondPrice = (0.50).toFixed(2);
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
                tempTotals[0].subvalue.value = response * 0.9;

                setTotalValueLocked(0.9 * (response / Math.pow(10, decimals)))
                setTotals([...tempTotals]);
            });

            const paidOut = localStakingContract.paidOut().then(response => {
                let tempTotals = [...totals];
                tempTotals[1].value.value = response;
                tempTotals[1].subvalue.value = response * esirprice;
                setTotals([...tempTotals]);
            });

            //My Earned PEAKDEFI(2) && My Staked PEAKDEFI(1)
            const userInfoP = localStakingContract.userInfo(address).then(response => {
                let tempStakingStats = [...stakingStats];
                console.log(response.amount)
                tempStakingStats[1].value = response.amount ;
                tempStakingStats[1].subvalue.value = response.amount * 0.9;

                setStakingStats([...tempStakingStats]);

                setStakeBalance(parseInt(response.amount.toString()));

                //updating staking balance globally
                dispatch(setBalance(parseInt(response.amount.toString())));
            });



            //current APY
            const stakingPercentP = localStakingContract.totalDeposits().then((response) => {
                const Esireprice = esirprice; // replace with the actual value of Esireprice
                const stakingPercent = ((((1 + (Esireprice / (0.90*1000))) ** 365) - 1) * 100) * Math.pow(10, decimals);

                
                let tempStakingStats = [...stakingStats];
                tempStakingStats[0].value = stakingPercent;
                setStakingStats([...tempStakingStats]);
                console.log(tempStakingStats[0].value);
                
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
           

                const userInfoW = localStakingContract.userInfo(address).then(response => {
                let tempStakingStats = [...stakingStats];
                console.log(response.totalwithdraw)
                tempStakingStats[3].value = response.totalwithdraw ;
                tempStakingStats[3].subvalue.value = response.totalwithdraw * esirprice;

                setStakingStats([...tempStakingStats]);



                 console.log(tempStakingStats[3].value.toString(10));
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
                const stakingPercent = ((((1 + (Esireprice / (0.90*1000))) ** 365) - 1) * 100) * Math.pow(10, decimals);

                
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

            console.log(localStakingContract);
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
    }, []);
  
  
  
  }


  return (
    <div className={classes.MainSCreen}>
      {/* Your other components or UI elements go here */}
      <div className={classes.buttons}>
        {/* Your button components go here */}
      </div>

      {/* Rendering the Features component with calculated values */}
      <Features
        total={totalValueLocked}
        stakeBalance={MystakeBalance}
        totaldist={totalValueDistributed}
      />
 
      {/* AnimationOnScroll component */}
      <AnimationOnScroll animateIn="animate__fadeInUp" animateOut="animate__fadeOutDown" animateOnce={true}>
        {/* Your other components go here */}
        {/* <IDO /> */}
      </AnimationOnScroll>

      {/* GiveAwayPanel component */}
      {/* <GiveAwayPanel show={showGiveaway} setShow={setShowGiveaway} /> */}
    </div>
  );
}

export default MainScreen;
