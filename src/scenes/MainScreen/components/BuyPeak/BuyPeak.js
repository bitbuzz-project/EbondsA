import React from "react";
import classes from "./Info.module.scss"
import Arrow from '../../../../resources/link_arrow.svg'
import FirstImg from './images/first.svg'
import SecondImg from './images/second.svg'
import ThirdImg from './images/third.svg'
import FourthImg from './images/fourth.svg'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

function BuyPeak(props, navigate) {

    return (
        <div key={props.title} className={classes.infoBlock}>
            <div className={classes.title} > {props.title} </div>
            <div className={classes.text} > {props.text} </div>
            <div className={classes.link} onClick={() => navigate(props.link)} >
                <img alt="link" src={Arrow} />
            </div>
        </div>
    )

}


function participateBlock(props, navigate) {

    return (<div key={props.title} className={classes.participateBlock}>


        <div>
            <div className={classes.imgBlock} >
                <img alt="" src={props.img} />
            </div>
            <div className={classes.title} > {props.title} </div>
            <div className={classes.text} > {props.text} </div>
        </div>

        <div>


            <div className={classes.link} onClick={() => {
                if (props.link.link === "" && !!props.link.onClick) {
                    props.link.onClick();
                }
                else if (props.link.link === "") {
                    return;
                }
                navigate(props.link.link)

            }}>


                {!!props.link.scrollTo &&
                    <Link to="ongoingSale" spy={true} smooth={true} offset={0} duration={500}>
                        {props.link.text}
                    </Link>
                }

                {
                    !props.link.scrollTo &&
                    <>{props.link.text}</>
                }
            </div>

        </div>
    </div>)
}

const Info = () => {
    const navigate = useNavigate();

    const [dataToShowInfo, setDataToShowInfo] = useState([
        {
            title: "About",
            text: "Let's dig into PEAKDEFI Launchpad and what it stands for",
            link: "/about"
        },
        {
            title: "Tier System",
            text: "Get to know more about the IDO allocation system here",
            link: "/tier-system"
        },
        {
            title: "How To Stake",
            text: "Time for action! This guide enlights you on your blockchain investment path",
            link: "/allocation-staking"
        },

    ]);
    const [dataToShowParticipate, setDataToShowParticipate] = useState([
        {
            img: FirstImg,
            title: "Register and KYC",
            text: "In order to participate in sales on PEAKDEFI Launchpad, you must register and KYC first. You can still stake and earn PeakDefi without registering.",
            link: {
                link: "",
                onClick: () => { document.getElementById('blockpass-kyc-connect').click() },
                text: "Start the KYC process"
            }
        },
        {
            img: SecondImg,
            title: "Verify Wallet",
            text: "Once you have registered and submitted your KYC, you must verify your wallet. This is the only wallet you will be able to use for sales.",
            link: {
                link: "",
                onClick: () => { document.getElementById('blockpass-kyc-connect').click() },
                text: "Verify Wallet"
            }
        },
        {
            img: ThirdImg,
            title: "Allocation Staking",
            text: "By staking PeakDefi, you earn allocation in IDOs. If you do not want to participate in sales, you can still benefit from staking.",
            link: {
                link: "/allocation-staking",
                text: "Stake PEAK"
            }
        },
        {
            img: FourthImg,
            title: "Register for Sale",
            text: "During the registration period, you must confirm your interest in participation. Once registration closes, you will not be able to register until the next sale.",
            link: {
                link: "",
                scrollTo: 'ongoingSale',
                text: "Register"
            }
        },
    ]);

    return (<div className={classes.Info}>

        <div className={classes.infoBlocks}>
            {
                dataToShowInfo.map(data => {
                    return BuyPeak(data, navigate)
                })
            }
        </div>

        <div className={classes.titleBlock} > How to Participate </div>

        <div className={classes.participateBlocks}>
            {
                dataToShowParticipate.map(data => {
                    return participateBlock(data, navigate)
                })
            }
        </div>
    </div>);
}

export default BuyPeak;