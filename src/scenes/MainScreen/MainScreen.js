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

const MainScreen = () => {
  const decimals = useSelector(state => state.userWallet.decimal);
  const address = useSelector(state => state.userWallet.address);

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
  ]);

  const [vartotals, setvarTotals] = useState([
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
  ]);

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

  const [price, setPrice] = useState(0);
  const [stakeBalance, setStakeBalance] = useState(0);
  const [totalDepositsP, setTotalDepositsP] = useState(0);

  const [stakingContract, setStakingContract] = useState();
  const provider = new ethers.providers.JsonRpcProvider(RpcProvider);
  const [totalValueLocked, setTotalValueLocked] = useState(0);
  const [totalValueDistributed, setTotalValueDistributed] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getInfo();
  }, []);

  async function getInfo() {
    const localStakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
    setStakingContract(localStakingContract);

    try {
      const totalDepositsResult = await localStakingContract.totalDeposits();
      const totalDepositsValue = parseInt(totalDepositsResult.toString());
      setTotalDepositsP(totalDepositsValue);

      // Fetching total deposits
      let tempTotals = [...totals];
      tempTotals[0].value.value = totalDepositsValue;
      tempTotals[0].subvalue.value = totalDepositsValue * 1;
      setTotalValueLocked(totalDepositsValue / Math.pow(10, decimals));
      setTotals([...tempTotals]);

      // Fetching total distributed
      const totalDistributed = await localStakingContract.paidOut();
      let tempTotalsVar = [...vartotals];
      tempTotalsVar[0].value.value = parseInt(totalDistributed.toString());
      tempTotalsVar[0].subvalue.value = totalDistributed * 1;
      setTotalValueDistributed(totalDistributed / Math.pow(10, decimals));
      setvarTotals([...tempTotalsVar]);

      // Fetching user info
      const userInfoP = await localStakingContract.userInfo(address);
      let tempStakingStats = [...stakingStats];
      tempStakingStats[1].value = userInfoP.amount;
      tempStakingStats[1].subvalue.value = userInfoP.amount * price;
      setStakingStats((userInfoP.amount / Math.pow(10, decimals)));
      setStakingStats([...tempStakingStats]);
        // Extracting and setting the user's deposit
      const userDeposit = userInfoP.amount;  // Adjust this line based on your userInfoP structure
      setStakeBalance(userDeposit);
      dispatch(setStakeBalance(parseInt(userInfoP.amount.toString())));
    } catch (error) {
      console.error("Error fetching staking information:", error);
    }
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
        totaldist={totalValueDistributed}
      />

      {/* AnimationOnScroll component */}
      <AnimationOnScroll animateIn="animate__fadeInUp" animateOut="animate__fadeOutDown" animateOnce={true}>
        {/* Your other components go here */}
      </AnimationOnScroll>

    </div>
  );
}

export default MainScreen;
