import React, { useState, useEffect } from 'react';
import classes from "./Info.module.scss"
import Arrow from '../../../../resources/link_arrow.svg'
import FirstImg from './images/first.svg'
import SecondImg from './images/second.svg'
import ThirdImg from './images/third.svg'
import FourthImg from './images/fourth.svg'
import imageUrl from './images/esir.png'
import { useNavigate } from "react-router-dom"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { fetchUSDTPrice } from '../../../AdminPanel/API/media'
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast, Flip } from 'react-toastify';
function infoBlock(props, navigate) {
    return (
        <div key={props.title} className={classes.infoBlock}>
            <div className={classes.title}>{props.title}</div>
            <div className={classes.text}>{props.text}</div>
        </div>
    )
}

function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000 && num < 10 ** 9) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num > 10 ** 9) {
        return ((num / (10 ** 9)).toFixed(2) + 'B');
    } else if (num < 900) {
        return num.toFixed(2); // if value < 1000, nothing to do
    }
}

function participateBlock(props, navigate) {
    return (
        <div key={props.title} className={classes.participateBlock}>
            <div>
                <div className={classes.imgBlock}>
                    <img alt="" src={props.img} />
                </div>
                <div className={classes.title}>{props.title}</div>
                <div className={classes.text}>{props.text}</div>
            </div>
            <div>
                <div className={classes.link} onClick={() => {
                    if (props.link.link === "" && !!props.link.onClick) {
                        props.link.onClick();
                    } else if (props.link.link === "") {
                        return;
                    }
                    navigate(props.link.link)
                }}>
                    {!!props.link.scrollTo &&
                        <Link to="ongoingSale" spy={true} smooth={true} offset={0} duration={500}>
                            {props.link.text}
                        </Link>
                    }
                    {!props.link.scrollTo &&
                        <>{props.link.text}</>
                    }
                </div>
            </div>
        </div>
    )
}



const Info = ({ total, totaldist }) => {
  
  const [price, setPrice] = useState(null);
  const decimals = useSelector(state => state.userWallet.decimal);
  useEffect(() => {
      const fetchData = async () => {
          try {
              const arbPrice = await fetchUSDTPrice();
              const eBondPrice = arbPrice;
              setPrice(eBondPrice);
          } catch (error) {
              console.error('Error fetching price:', error);
          }
      };
      fetchData();
  }, []);
  const address = '0xbdc9ef4e74ed480688160d04a79664487b11cd17';
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
  const navigate = useNavigate();
  const EsirPrice = price;
  const stakingPercent = (((1 + EsirPrice / (0.90 * 1000)) ** 365 - 1) * 100).toFixed(2);
  const formattedTotal = (total / 10000000000).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
  });
  const MarketCap = (EsirPrice * 1150000).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

  const distributedVar = ((totaldist / 10000000000) * EsirPrice).toFixed(2) ;
      
      const [dataToShowInfo, setDataToShowInfo] = useState([
        {
          title: "Low Risk Strategy",
          text: "EBONDS.Finance has a simple approach to lower timing risk and strategy risk",
          link: "/feature1",
        },
        {
          title: "P2P MarketPlace",
          text: "Increased volume and direct trades between users, arbitrage opportunities between users",
          link: "/feature2",
        },
        {
          title: "Up to 20% Apy",
          text: "Unlock your potential with estimated average APY ranges, offering growth opportunities from 15–25% all the way up to 40–60%.",
          link: "/feature3",
        },
        {
          title: "High Rewarding",
          text: "Asset diversification with high stable allocations and mainly operating with strong and safe protocols",
    
          link: "/feature4",
        },
      ]);
      
      return (
        <div className={classes.Info}>
          <div className={classes.featureCards}>
            <div className={classes.leftText}>
              <h2>About ESIR Tokens</h2>
              <p>ESIR Tokens are created to eliminate fractional reserve and speculative growth and are mainly available to EBONDS Stakers. In order to facilitate trades of ESIR Tokens on a decentralized exchange, EBONDS provide the necessary collateral backing, yield/reward generating strategies, and Protocol-Owned Liquidity.</p>
              <p>ESIR Price : ${EsirPrice}</p>
              <p>Total Market Cap : {MarketCap}</p>
              <p className={classes.CopyInput}>
              0xbdc9ef4e74ed480688160d04a79664487b11cd17  <div className={classes.element} onClick={() => { navigator.clipboard.writeText(address); copiedToClipboard() }}>
    <svg fill="none" height="16" viewBox="0 0 17 16" width="17" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.04236 12.3027H4.18396V13.3008C4.18396 14.8525 5.03845 15.7002 6.59705 15.7002H13.6244C15.183 15.7002 16.0375 14.8525 16.0375 13.3008V6.24609C16.0375 4.69434 15.183 3.84668 13.6244 3.84668H12.4828V2.8418C12.4828 1.29688 11.6283 0.442383 10.0697 0.442383H3.04236C1.48376 0.442383 0.629272 1.29004 0.629272 2.8418V9.90332C0.629272 11.4551 1.48376 12.3027 3.04236 12.3027ZM3.23376 10.5391C2.68689 10.5391 2.39294 10.2656 2.39294 9.68457V3.06055C2.39294 2.47949 2.68689 2.21289 3.23376 2.21289H9.8783C10.4252 2.21289 10.7191 2.47949 10.7191 3.06055V3.84668H6.59705C5.03845 3.84668 4.18396 4.69434 4.18396 6.24609V10.5391H3.23376ZM6.78845 13.9365C6.24158 13.9365 5.94763 13.6699 5.94763 13.0889V6.45801C5.94763 5.87695 6.24158 5.61035 6.78845 5.61035H13.433C13.9799 5.61035 14.2738 5.87695 14.2738 6.45801V13.0889C14.2738 13.6699 13.9799 13.9365 13.433 13.9365H6.78845Z" fill="currentColor"></path>
    </svg>
    <div className={classes.width}>
     
    </div>
  </div>
</p>

                      
<a href="https://arbiscan.io/token/0x8c75a1c86c21b74754fc8e3bc4e7f79b4fcc5a28" className={classes.btn}>
    Go to Explorer
</a>
    
            </div>
            <div className={classes.rightCards}>
            
            <img src={imageUrl} alt="Image" className={classes.centeredImage} />

            
            </div>
          </div>
        </div>
      );
    };

export default Info;
