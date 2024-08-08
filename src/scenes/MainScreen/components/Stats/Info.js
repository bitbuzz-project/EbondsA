import React, { useState, useEffect } from 'react';
import classes from "./Info.module.scss"
import Arrow from '../../../../resources/link_arrow.svg'
import FirstImg from './images/first.svg'
import SecondImg from './images/second.svg'
import ThirdImg from './images/third.svg'
import FourthImg from './images/fourth.svg'
import { useNavigate } from "react-router-dom";
import { fetchUSDTPrice } from '../../../AdminPanel/API/media'
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { useDispatch, useSelector } from 'react-redux';
function infoBlock(props, navigate) {
    return (
        <div key={props.title} className={classes.infoBlock}>
            <div className={classes.title}>{props.title}</div>
            <div className={classes.text}>{props.text}</div>
            <div className={classes.value}>{props.value}</div>
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

    const navigate = useNavigate();
    const EsirPrice = price;
    const stakingPercent = (((1 + EsirPrice / (0.90 * 1000)) ** 365 - 1) * 100).toFixed(2);
    const formattedTotal = (total / 10000000000).toLocaleString("en-US", {
 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const formattedTotalVal = ((total)*0.9 / 10000000000).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const distributedVar = ((totaldist / 10000000000) * EsirPrice).toFixed(2) ;
    const distributedESIR = ((totaldist / 10000000000)).toFixed(2) ;
    useEffect(() => {
        const updatedDataToShowInfo = [
            {
                title: "Total EBONDS Staked",
                text: `${formattedTotal}`,
                value: formattedTotalVal,
                link: "/about"
            },
            {
                title: "Total ESIR Rewards",
                text: distributedESIR !== null ? `${distributedESIR}` : "Loading...",
                value: `$${distributedVar}`,
                link: "/tier-system"
            },
    
            {
                title: "Current APY",
                text: stakingPercent !== null ? `%${stakingPercent}` : "Loading...",
                link: "/allocation-staking"
            }
      
        ];

        setDataToShowInfo(updatedDataToShowInfo);
    }, [formattedTotal, EsirPrice]);

    const [dataToShowInfo, setDataToShowInfo] = useState([]);
 

    return (
        <div className={classes.Info}>
            <div className={classes.infoBlocks}>
                {dataToShowInfo.map(data => {
                    return infoBlock(data, navigate)
                })}
            </div>
    
          
        </div>
    );
}

export default Info;
