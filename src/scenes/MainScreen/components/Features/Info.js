import React from "react";
import { useState, useEffect } from 'react'
import classes from "./Info.module.scss";
import Arrow from "../../../../resources/link_arrow.svg";
import decor from "../../../../resources/ebs-decor.png";
import FirstImg from "./images/first.svg";
import SecondImg from "./images/second.svg";
import ThirdImg from "./images/third.svg";
import FourthImg from "./images/fourth.svg";
import InfoIcon from '@mui/icons-material/Info';
import { useRef } from 'react';
import { Tooltip } from '@mui/material';
import { fetchUSDTPrice } from '../../../AdminPanel/API/media';
import { fetchLast5Prices } from '../../../AdminPanel/API/media';
import { fetchEbPrice } from '../../../AdminPanel/API/Ebmedia';
import { useNavigate } from "react-router-dom";
import TransactionHistory from "../TransactionHistory/Info"; // Adjust the import path based on your project structure
import TradingViewWidget from "../Transactionchart/Info";
import CirclesOverlap from "../chart/Info"; // Adjust the import path based on your project structure
import { useWeb3React } from '@web3-react/core';
import EsirPriceCard from "../../../AllocationStaking/components/EsirPriceCard/EsirPriceCard"
// import {setNewTokenBalance,setNewTokenDecimal,} from '../../../../features/userWalletSlice'; // Replace with the correct path
import { abi, stakingContractAddress } from "../../services/consts";
import FadeIn from 'react-fade-in';
import { ethers } from 'ethers';
import { RpcProvider } from '../../../../consts/rpc';
import { useDispatch, useSelector } from 'react-redux';
import { Chart , ArcElement, Legend } from "chart.js";
const tokenContractAddress = "0x53Ee546eB38fB2C8b870f56DeeaeCF80367a4551";
function FeatureCard(props) {
  return (
    <div key={props.title} className={classes.featureCard}>
      {/* <div className={classes.imgBlock}>
        <img alt="" src={props.img} />
      </div> */}
      <div className={classes.title}>{props.title}</div>
      <div className={classes.text}>{props.text}</div>
    </div>
  );  
}
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
const Info = ({ total, totaldist }) => {
  const navigate = useNavigate();
  const [esirprice, setesirPrice] = useState(null);
  const [lastTrades, setlastTrades] = useState(null);
  const [ebondPrice, setebondPrice] = useState(null);
  const decimals = useSelector(state => state.userWallet.decimal);
  const totalusd = total*ebondPrice;
  const [pendingrewards, setpendingrewards] = useState(0);
  const formattedTotal = (total / 10000000000).toLocaleString("en-US", {
    
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});



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

const [stakeBalance, setStakeBalance] = useState(0);
const [stakingContract, setStakingContract] = useState();
const provider = new ethers.providers.JsonRpcProvider(RpcProvider);



const formattedTotalUsd = (totalusd / 10000000000).toLocaleString("en-US", {
 
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const dispatch = useDispatch();
const address = useSelector(state => state.userWallet.address);
const chartRef = useRef(null);

useEffect(() => {
  const fetchPrices = async () => {
      try {
          const esirPrice = await fetchUSDTPrice();
          setesirPrice(esirPrice);
          const last5Trades = await fetchLast5Prices();
          setlastTrades(last5Trades);
          console.log(lastTrades);
          const eBondPrice = await fetchEbPrice();
          setebondPrice(eBondPrice);
      } catch (error) {
          console.error("Error fetching prices:", error);
      }
  };

  
  async function getInfo() {
    console.log("Address:", address); // Add this line
    const { ethereum } = window;
    if (ethereum && address) {
    const localStakingContract = new ethers.Contract(stakingContractAddress, abi, provider);
      setStakingContract(localStakingContract);

      try {
          const userInfoP = await localStakingContract.userInfo(address);
          let tempStakingStats = [...stakingStats];
          setStakingStats([...tempStakingStats]);

          const userDeposit = userInfoP.amount;
          setStakeBalance(userDeposit);
          dispatch(setStakeBalance(parseInt(userInfoP.amount.toString())));

          //////////////////////////////////
          
      } 
      catch (error) {
          console.error("Error fetching staking information:", error);
      }

      try {
        const { ethereum } = window;
        const lprovider = new ethers.providers.Web3Provider(ethereum)
        const signer = lprovider.getSigner();
        const tstakingContract = new ethers.Contract(stakingContractAddress, abi, signer)
        let pendingP;
        pendingP = tstakingContract.pending().then(response => {
          let tempStakingStats = [...stakingStats];
          tempStakingStats[2].value = response;
          setStakingStats([...tempStakingStats]);
          const userpending = tempStakingStats[2].value;
          console.log(tempStakingStats[2].value.toString(10));
                      setpendingrewards(userpending);
                      
                  });


      } catch (error) {
        console.error("Error fetching staking information:", error);
    }

  }};

           

        
  const fetchData = async () => {
      await fetchPrices();
      await getInfo();
  };

  fetchData();
  }, [address, dispatch]);

  
  const [countdown, setCountdown] = useState(calculateCountdown()); // Set initial countdown value

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    // Chart rendering logic
    if (chartRef.current && lastTrades) {
      const ctx = chartRef.current.getContext('2d');
  
      // Create a linear gradient for the background
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(247,147,26,.5)');
      gradient.addColorStop(0.425, 'rgba(255,193,119,0)');
  
      // Configure the Chart.js settings
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: lastTrades.length }, (_, i) => ``),
          datasets: [
            {
              label: 'EBONDS Prices',
              data: lastTrades.map((trade) => parseFloat(trade)),
              backgroundColor: gradient,
              borderColor: 'rgba(247,147,26,1)',
              borderJoinStyle: 'round',
              borderCapStyle: 'round',
              borderWidth: 3,
              pointRadius: 0,
              pointHitRadius: 10,
              lineTension: 0.2,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'EBONDS Price Movements',
            fontSize: 20,
            fontColor: '#333', // Adjust font color if needed
          },
          legend: {
            display: false,
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 20, // Adjust top padding for the title
              bottom: 0,
            },
          },
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              grid: {
                color: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                display: false,
              },
            },
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                callback: function (value, index, values) {
                  return parseFloat(value).toPrecision(3);
                },
              },
            },
          },
          tooltips: {
            callbacks: {
              title: function () {}, // Remove the tooltip title
            },
            displayColors: false,
            yPadding: 10,
            xPadding: 10,
            position: 'nearest',
            caretSize: 10,
            backgroundColor: 'rgba(255,255,255,.9)',
            bodyFontSize: 12,
            bodyFontColor: '#303030',
          },
        },
      });
    }
  }, [lastTrades]);
  
  
  
  function calculateCountdown() {
    // Set your target date here (year, month (0-indexed), day, hour, minute, second)
    const targetDate = new Date('2024-01-31T23:59:59');
    const currentDate = new Date();

    const timeDifference = targetDate - currentDate;

    // Calculate remaining time components
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const stakingPercent = ((((1 + (esirprice / ((0.865)*1000))) ** 365) - 1) * 100);
  const EBONDSROI = ((ebondPrice / 0.865) - 1)*100;

  const WEI_DIVISOR = 1e18;
  const balance = useSelector(state => state.userWallet.balance / (10 ** state.userWallet.decimal));
  const newTokenBalance = useSelector(state => state.userWallet.newTokenBalance / (10 ** state.userWallet.newTokenDecimal));
  const stkeBalance = stakeBalance / WEI_DIVISOR;
  const pendingtoken = pendingrewards / WEI_DIVISOR
  const { account } = useWeb3React();
    const svgContent = 'url("<svg id="bfbeadc9-83b1-4f6b-b770-b3a2dcde9763" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 349.9 463.15"><path class="b1ef4d73-6d94-400b-b3d7-490ae8b1a74a" d="M250.31,18.43c26.25,28.07,54.87,54.48,79.39,84.05,26.89,33.82,31.23,82.63,4.1,117.72-25.38,31-56.13,57.71-83.73,86.73-14.67-16.56-33.43-28.94-33.91-53.22C226.49,222.64,267.57,204,277.51,172c5.2-21.29-15.77-40-27-55.9-29.56,30-60.24,59.13-89.25,89.65-20.19,20.73-28.62,57.16-7,79.79,30.91,33.83,64.26,65.6,96,98.72,30.75-30.75,61.1-61.9,91.85-92.65,18-18.37,37.38-38.55,47.39-62.6,7.49-17.51,6.94-39.43,8.44-58.27,13.24,24.44,26.57,46.28,27,75.22,1.5,42.1-19.47,75.38-47.38,104.71q-63.4,65.76-127.58,130.88-64.21-65.76-128.2-131.91c-25.63-26.81-45.1-57.4-46.6-95.64-1.26-41.24,19.08-74.82,46.75-103.6C159.32,111.78,245,23.79,250.31,18.43Z" transform="translate(-75.05 -18.43)"></path></svg>")';

  return (
    <div className={classes.Info}>
      <FadeIn>
      <div className={classes.featureCards}>
        {/* Parent Container for Available Funds and Your Custom Card Title */}
        <div className={`${classes.cardContainer} ${classes.dFlex} ${classes.flexColumn}`}>
          {/* Available Funds Card */}
          <div className={`${classes.card} ${classes.cardWithBorder}`}>
            <div className={`${classes.ms2} ${classes.cDetails}`}>
              <h6 className={classes.mb0}>My balance</h6>
              <span className={classes.cDetailsText}>${(((newTokenBalance*(esirprice)) + (balance*ebondPrice) + (stkeBalance*ebondPrice) + (pendingtoken*esirprice) ).toLocaleString("en-US", {
 
 minimumFractionDigits: 0,
 maximumFractionDigits: 2,
}))}</span>
            </div>
            <div className={classes.badge}>
              <span className={classes.badgeSpan}>Overall Funds </span>
            </div>
            <div className={classes.mt5}>
              <div className={classes.mt5}>
                <div className={classes.progress}>
                  <div className={classes.progressBar} style={{ width: '50%' }}></div>
                </div>
                <div className={`${classes.cardFooter} ${classes.cardWithBorder}`}>
                  <div className={classes.mt3} >
                
                  <div className={`${classes.cardsRow}`}>
  {/* First group */}
  <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#9E9E9E', borderRadius: '25px', padding: '18px', marginRight: '8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius: '25px', padding: '8px', marginRight: '8px' }}>
        <svg
          id="bfbeadc9-83b1-4f6b-b770-b3a2dcde9763"
          data-name="Calque 1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="25"
          height="25"
          viewBox="0 0 349.9 463.15"
        >
          <path className="b1ef4d73-6d94-400b-b3d7-490ae8b1a74a" d="M250.31,18.43c26.25,28.07,54.87,54.48,79.39,84.05,26.89,33.82,31.23,82.63,4.1,117.72-25.38,31-56.13,57.71-83.73,86.73-14.67-16.56-33.43-28.94-33.91-53.22C226.49,222.64,267.57,204,277.51,172c5.2-21.29-15.77-40-27-55.9-29.56,30-60.24,59.13-89.25,89.65-20.19,20.73-28.62,57.16-7,79.79,30.91,33.83,64.26,65.6,96,98.72,30.75-30.75,61.1-61.9,91.85-92.65,18-18.37,37.38-38.55,47.39-62.6,7.49-17.51,6.94-39.43,8.44-58.27,13.24,24.44,26.57,46.28,27,75.22,1.5,42.1-19.47,75.38-47.38,104.71q-63.4,65.76-127.58,130.88-64.21-65.76-128.2-131.91c-25.63-26.81-45.1-57.4-46.6-95.64-1.26-41.24,19.08-74.82,46.75-103.6C159.32,111.78,245,23.79,250.31,18.43Z" transform="translate(-75.05 -18.43)"/>
        </svg>
        <span style={{ marginLeft: '8px' }}>EBONDS</span>
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
        <div>{numFormatter(stkeBalance + balance)}</div>
        <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#707070' }}>≈ ${numFormatter((stkeBalance + balance) * ebondPrice)}</div>
      </span>
    </div>
  </span>

  {/* Second group */}
  <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: '25px', padding: '18px', marginRight: '8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius: '25px', padding: '8px', marginRight: '8px' }}>
        <svg id="bfbeadc9-83b1-4f6b-b770-b3a2dcde9763" data-name="Calque 1" width="20" height="20" viewBox="0 0 349.9 463.15" fill="black">
          <defs>
            <clipPath id="clip-path" transform="translate(0.01 0.04)">
              <path className="cls-1" d="M.45,147.75a114.89,114.89,0,0,1,141-122h0c89.74,21.32,143.82-15.5,143.82-15.5s.12,1.41.34,3.9a99.87,99.87,0,0,1-136.77,101.5h0C82.41,89,1.75,162.26,1.75,162.26S1.24,156.52.45,147.75Z"></path>
            </clipPath>
            <clipPath id="clip-path-2" transform="translate(0.01 0.04)">
              <path className="cls-1" d="M.45,265.9a114.89,114.89,0,0,1,141-122h0c89.74,21.33,143.82-15.49,143.82-15.49s.12,1.41.34,3.9A99.85,99.85,0,0,1,148.84,233.8h0C82.41,207.05,1.75,280.41,1.75,280.41S1.24,274.67,.45,265.9Z"></path>
            </clipPath>
            <clipPath id="clip-path-3" transform="translate(0.01 0.04)">
              <path className="cls-1" d="M.45,384a114.88,114.88,0,0,1,141-122h0c89.74,21.32,143.82-15.49,143.82-15.49s.12,1.4,.34,3.89A99.87,99.87,0,0,1,148.84,352h0C82.42,325.21,1.76,398.56,1.76,398.56S1.24,392.82,.45,384Z"></path>
            </clipPath>
          </defs>
          <g id="Calque_1-2" data-name="Calque 1">
            <path fill="black" d="M.45,147.75a114.89,114.89,0,0,1,141-122h0c89.74,21.32,143.82-15.5,143.82-15.5s.12,1.41.34,3.9a99.87,99.87,0,0,1-136.77,101.5h0C82.41,89,1.75,162.26,1.75,162.26S1.24,156.52.45,147.75Z" transform="translate(0.01 0.04)"></path>
            <g className="cls-3">
              <path fill="black" className="cls-4" d="M2.12,185.77A108.13,108.13,0,0,1,146,72.48h0C237.3,105.11,294.21,0,294.21,0s.09,25.57.21,55.87A105.86,105.86,0,0,1,149,154.42h0C82.6,127.67,4.29,206.06,4.29,206.06S3.41,197.79,2.12,185.77Z" transform="translate(0.01 0.04)"></path>
            </g>
            <path fill="black" d="M.45,265.9a114.89,114.89,0,0,1,141-122h0c89.74,21.33,143.82-15.49,143.82-15.49s.12,1.41.34,3.9A99.85,99.85,0,0,1,148.84,233.8h0C82.41,207.05,1.75,280.41,1.75,280.41S1.24,274.67,.45,265.9Z" transform="translate(0.01 0.04)"></path>
            <g className="cls-6">
              <path fill="black" className="cls-4" d="M2.12,304A108.12,108.12,0,0,1,146,190.63h0c91.29,32.63,148.2-72.49,148.2-72.49s.09,25.58.21,55.88A105.86,105.86,0,0,1,149,272.61h0C82.6,245.86,4.29,324.26,4.29,324.26S3.41,316,2.12,304Z" transform="translate(0.01 0.04)"></path>
            </g>
            <path fill="black" d="M.45,384a114.88,114.88,0,0,1,141-122h0c89.74,21.32,143.82-15.49,143.82-15.49s.12,1.4,.34,3.89A99.87,99.87,0,0,1,148.84,352h0C82.42,325.21,1.76,398.56,1.76,398.56S1.24,392.82,.45,384Z" transform="translate(0.01 0.04)"></path>
            <g className="cls-8">
              <path fill="black" className="cls-4" d="M2.12,422.06A108.13,108.13,0,0,1,146,308.78h0c91.29,32.62,148.2-72.49,148.2-72.49s.09,25.58,.21,55.88A105.86,105.86,0,0,1,149,390.75h0C82.6,364,4.29,442.39,4.29,442.39S3.41,434.08,2.12,422.06Z" transform="translate(0.01 0.04)"></path>
            </g>
          </g>
        </svg>
        <span style={{ marginLeft: '8px' }}>ESIR</span>
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
        <div>{numFormatter(pendingtoken + newTokenBalance)}</div>
        <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#707070' }}>≈ ${numFormatter((pendingtoken + newTokenBalance) * esirprice)}</div>
      </span>
    </div>
  </span>
</div>

                  </div>
                </div>
              </div>
            </div>
          </div>
       


          {/* Your Custom Card Title */}
          <div className={`${classes.cardsRow}`}>
      {/* Real-Time APY Card */}
      <div className={`${classes.blackcard} ${classes.cardWithBorder}`}>
        <div className={`${classes.ms2} ${classes.cDetails}`}>
          <h6 className={classes.mb0}>EBONDS Real-Time ROI</h6>
          <div className={classes.apr}>{(EBONDSROI).toFixed(2)}%</div>
          <div className={classes.note}>Return on Investment <Tooltip title="ROI based on End of Phase I post airdrop price"><InfoIcon /></Tooltip></div>
        </div>
        {/* Add any additional elements for the new card header here */}
        {/* Add the body content for the new card here */}
      </div>
      <div className={`${classes.blackcard} ${classes.cardWithBorder}`}>
        <div className={`${classes.ms2} ${classes.cDetails}`}>
          <h6 className={classes.mb0}>ESIR Real-Time APY</h6>
          <div className={classes.apr}>{(stakingPercent).toFixed(2)}%</div>
          <div className={classes.note}>Annual Percentage Yield <Tooltip title="APY based on End of Phase I post airdrop price"><InfoIcon /></Tooltip></div>
        </div>
        {/* Add any additional elements for the new card header here */}
        {/* Add the body content for the new card here */}
      </div>
      
  
    </div>

    <div className={`${classes.cardsRow}`}>
  {/* Total EBONDS Staked Card */}
  <div className={`${classes.stakecard} ${classes.cardWithBorder}`}>
          <div className={`${classes.ms2} ${classes.cDetails}`}>
    <div style={{ position: 'relative', zIndex: 2 }}>
    <h6 style={{ color: 'rgb(235 235 235)',  fontSize: '20px', fontWeight: '500'}} className={classes.mb0}>Total EBONDS Staked</h6>
    <div style={{ color: 'white'}} className={classes.apr}>{formattedTotal}</div>
      {/* <div style={{ color: 'rgb(235 235 235)',}} className={classes.stakenote}>TVL Value $ {formattedTotalUsd} <Tooltip title="Contirbutions to the DeFi-Treasury & Strategies to generate LP Fees"><InfoIcon /></Tooltip></div> */}
      <div style={{ color: 'rgb(235 235 235)',}} className={classes.stakenote}></div>

    </div>
  </div>
  <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '30%', backgroundImage: `url(${decor})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 }}></div>
</div>

      
  
    </div>
    {/* Total EBONDS Staked Card */}
          <div className={`${classes.card} ${classes.cardWithBorder}`}>
      <div className={`${classes.ms2} ${classes.cDetails}`}>
        <h6 className={classes.mb0}>EBONDS Top allocation</h6>
      </div>
      <CirclesOverlap cardWidth={400} cardHeight={400} />
   </div>
      <div>
      
    
    </div>
   
        </div>
    
        {/* History Card (positioned on the right) */}
        <div className={`${classes.cardContainer} ${classes.dFlex} ${classes.flexColumn}`}>


        <div className={`${classes.card} ${classes.cardWithBorder}`}>
      <div className={`${classes.dFlex} ${classes.justifyContentBetween}`}>
        <div className={`${classes.dFlex} ${classes.flexRow} ${classes.alignItemsCenter}`}>
      
        </div>
      </div>
      
   {/* :::::::::::::::::::::::::::::::::::::::::::: */}
 
          <div style={{ 
  display: 'flex', 
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  backgroundColor: '#fff', 
  borderRadius: '10px', 
  padding: '15px', 

}}>
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    marginRight: '20px' 
  }}>
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '8px', 
      color: '#8c99ac',
      fontSize: '12px', 
      fontWeight: '500' 
    }}>
      EBONDS Price
    </div>
    <div style={{ 
      textAlign: 'center', 
      fontSize: '20px', 
      fontWeight: '500' 
    }}>
      ${ebondPrice}
    </div>
  </div>
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    marginRight: '20px' 
  }}>
   <div style={{ 
      textAlign: 'center', 
      marginBottom: '8px', 
      color: '#8c99ac',
      fontSize: '12px', 
      fontWeight: '500' 
    }}>
      ESIR Price
    </div>
    <div style={{ 
      textAlign: 'center', 
      fontSize: '20px', 
      fontWeight: '500' 
    }}>
      ${esirprice}
    </div>
  </div>
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-end' 
  }}>
    <a href="https://arbiscan.io/token/0x53ee546eb38fb2c8b870f56deeaecf80367a4551" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '10px', 
      color: '#6c757d', 
      textDecoration: 'underline' 
    }}>
      EBONDS
      <svg
        style={{ marginLeft: '5px' }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="15"
        height="15"
        viewBox="0 0 24 24"
      >
        <path d="M10 17l5-5-5-5v10z" fill="#6c757d" />
      </svg>
    </a>
    <a href="https://arbiscan.io/token/0x8c75a1c86c21b74754fc8e3bc4e7f79b4fcc5a28" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      color: '#6c757d', 
      textDecoration: 'underline' 
    }}>
      ESIR
      <svg
        style={{ marginLeft: '5px' }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="15"
        height="15"
        viewBox="0 0 24 24"
      >
        <path d="M10 17l5-5-5-5v10z" fill="#6c757d" />
      </svg>
    </a>
  </div>
</div>



{/* :::::::::::::::::::::::::::::::::::::::::::: */}

      <div className={`${classes.cardBody}`}>
  <div className={classes.mt6}>
  <TradingViewWidget />


  </div>

</div>


      <div className={`${classes.cardFooter} ${classes.timerContainer}`}>
       
      </div>
    </div>
        
        <div className={`${classes.card} ${classes.cardWithBorder} `}>
          <div className={`${classes.dFlex} ${classes.justifyContentBetween}`}>
            <div className={`${classes.dFlex} ${classes.flexRow} ${classes.alignItemsCenter}`}>
              <div className={`${classes.ms2} ${classes.headWithBorder} ${classes.cDetails}`}>
                <h6 className={classes.mb1}>History</h6>
              </div>
            </div>
          </div>
          <TransactionHistory account={account} tokenContractAddress={tokenContractAddress} />
        </div>
      
      
     
      </div>
      
        </div>
      </FadeIn>
    </div>
  );
};

export default Info;
