import React, { useEffect, useState } from "react";
import classes from './IdoDetail.module.scss'
import { MainInfo } from "./components/MainInfo/MainInfo";
import { IdoBlock } from "./components/IdoBlock/IdoBlock";
import DetailTable from "./components/DetailTable/DetailTable";
import { ethers } from 'ethers';

import { SALE_ABI, TOKEN_ABI } from '../../consts/abi'

// Image imports
import TestImg from "../MainScreen/components/IDOBlock/test_img.svg"
import Telegram from "./img/telegram.svg"
import Twitter from "./img/twitter.svg"
import Mediun from "./img/medium.svg"
import Img1 from './img/img1.svg'
import Img2 from './img/img2.svg'
import Img3 from './img/img3.svg'
import Img4 from './img/img4.svg'
import { getSingleIdo } from "../MainScreen/components/Table/API/idos";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setBG } from "../../features/projectDetailsSlice";
import { useNavigate } from 'react-router-dom';
import { RpcProvider } from "../../consts/rpc";


const IdoDetail = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const currentBg = useSelector(state=>state.projectDetails.bg_image);

    const [title, setTitle] = useState("A Fully-Decentralized Play-and-Earn Idle Game");
    const [text, setText] = useState('Crabada is an exciting play-and-earn NFT game based in a world filled with fierce fighting Hermit-Crabs called Crabada (the NFTs).');
    const [media, setMedia] = useState([
        {
            link: "", img: Telegram,
            imgMobile: "https://cdn-icons.flaticon.com/png/512/3670/premium/3670044.png?token=exp=1639986909~hmac=7e5f006cead8d6588bd91b5e6e9da32a"
        },
        {
            link: "", img: Twitter,
            imgMobile: "https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-twitter-4.png"
        },
        {
            link: "", img: Mediun,
            imgMobile: "https://cdns.iconmonstr.com/wp-content/assets/preview/2018/240/iconmonstr-medium-4.png",
        },
    ]);
    const [idoInfo, setIdoInfo] = useState({
        token: {
            name: "Platypus",
            symbol: "PTP",
            price: "0.0001",
            peakPrice: 0.01,
            img: TestImg
        },
        saleInfo: {
            totalRaised: 1050000,
            raised: 1000,
            partisipants: 10,
            start_date: 1639602566,
            end_date: 1639602566,
            token_price: 0.01,
            info: {
                time_until_launch: null,
                token_sold: 0,
                token_distribution: 1000,
                sale_progres: 73
            }
        }
    });
    const [dataToShowParticipate, setDataToShowParticipate] = useState([
        {
            img: Img1,
            title: "Registration Opens",
            text1: "Nov 2nd 2021",
            text2: "17:00",
            date: new Date(Date.now())
        },
        {
            img: Img2,
            title: "Registration Closes",
            text1: "Nov 2nd 2021",
            text2: "17:00",
            date: new Date(Date.now())
        },
        {
            img: Img3,
            title: "Sales",
            text1: "Nov 2nd 2021",
            text2: "17:00",
            date: new Date(Date.now())
        },
        {
            img: Img4,
            title: "Sale Ends",
            text1: "Nov 2nd 2021",
            text2: "17:00",
            date: new Date(Date.now())
        },
    ]);
    const [saleContract, setSaleContract] = useState();
    const [tokenContract, setTokenContract] = useState();

    const [ido, setIdo] = useState();

    const [searchParams, setSearchParams] = useSearchParams();



    useEffect(async () => {
        {
            getSingleIdo(parseInt(searchParams.get("id"))).then((response => {
                
                    dispatch(setBG(response.data.ido.project_detail.project_bg))
                
                const selectedIdo = response.data.ido;
                setIdo(selectedIdo);
                setTitle(selectedIdo.title);
                setText(selectedIdo.heading_text)
                let tIdoInfo = { ...idoInfo };

                tIdoInfo.token = {
                    name: selectedIdo.token.name,
                    symbol: selectedIdo.token.symbol,
                    price: parseFloat(selectedIdo.token.token_price_in_usd),
                    peakPrice: parseFloat(selectedIdo.token.token_price_in_avax),
                    img: selectedIdo.logo_url
                }


                tIdoInfo.saleInfo = {
                    totalRaised: selectedIdo.target_raised,
                    raised: selectedIdo.total_raised,
                    partisipants: selectedIdo.number_of_participants,
                    start_date: selectedIdo.timeline.sale_start,
                    end_date: selectedIdo.timeline.sale_ends,
                    token_price: parseFloat(selectedIdo.token.price_in_avax),
                    info: {
                        time_until_launch: selectedIdo.time_until_launch,
                        token_sold: parseFloat(selectedIdo.token.total_token_sold),
                        token_distribution: parseFloat(selectedIdo.token.token_distribution),
                        sale_progres: selectedIdo.percent_raised
                    }
                }

                setIdoInfo({ ...tIdoInfo });

                let tDataToShowParticipate = [...dataToShowParticipate];

                tDataToShowParticipate[0].date = new Date(selectedIdo.timeline.registration_start * 1000);
                tDataToShowParticipate[0].text1 = new Date(selectedIdo.timeline.registration_start * 1000).toLocaleString('en-US', { dateStyle: 'long' });
                tDataToShowParticipate[0].text2 = new Date(selectedIdo.timeline.registration_start * 1000).toLocaleTimeString();

                tDataToShowParticipate[1].date = new Date(selectedIdo.timeline.registration_end * 1000);
                tDataToShowParticipate[1].text1 = new Date(selectedIdo.timeline.registration_end * 1000).toLocaleString('en-US', { dateStyle: 'long' });
                tDataToShowParticipate[1].text2 = new Date(selectedIdo.timeline.registration_end * 1000).toLocaleTimeString();

                tDataToShowParticipate[2].date = new Date(selectedIdo.timeline.sale_start * 1000);
                tDataToShowParticipate[2].text1 = new Date(selectedIdo.timeline.sale_start * 1000).toLocaleString('en-US', { dateStyle: 'long' });
                tDataToShowParticipate[2].text2 = new Date(selectedIdo.timeline.sale_start * 1000).toLocaleTimeString();

                tDataToShowParticipate[3].date = new Date(selectedIdo.timeline.sale_end * 1000);
                tDataToShowParticipate[3].text1 = new Date(selectedIdo.timeline.sale_end * 1000).toLocaleString('en-US', { dateStyle: 'long' });
                tDataToShowParticipate[3].text2 = new Date(selectedIdo.timeline.sale_end * 1000).toLocaleTimeString();



                setDataToShowParticipate([...tDataToShowParticipate]);

                const provider = new ethers.providers.JsonRpcProvider(RpcProvider);

                const Salecontract = new ethers.Contract(selectedIdo.contract_address, SALE_ABI, provider)
                setSaleContract(Salecontract);

                const t_tokenContract = new ethers.Contract(selectedIdo.token.token_address, TOKEN_ABI, provider);
                setTokenContract(t_tokenContract);

                setMedia(selectedIdo.socials.map(e => {
                    return {
                        link: e.url,
                        img: e.logo_url,
                        imgMobile: e.logo_url
                    }
                }))
            }));

            const { ethereum } = window;
            if (ethereum) {
                let lidoInfo = {
                    token: {
                        name: "",
                        symbol: "",
                        price: "",
                        peakPrice: 0,
                        img: TestImg
                    },
                    saleInfo: {
                        totalRaised: 0,
                        raised: 0,
                        partisipants: 0,
                        start_date: 0,
                        end_date: 0,
                        token_price: 0,
                        info: {
                            time_until_launch: null,
                            token_sold: 0,
                            token_distribution: 0,
                            sale_progres: 0
                        },
                        user: {}
                    }
                }

            }
        }
    }, [])

    if (ido === undefined)
        return <></>

    return (<div className={classes.idoDetail} >
        <div className={classes.firstBlock}>
            <MainInfo
                title={title}
                text={text}
                media={media}
                saleContract={saleContract}
                tokenContract={tokenContract}
                ido={ido}
            />
            {IdoBlock(idoInfo, ido)}
        </div>

        <div className={classes.participateBlocks}>
            {
                dataToShowParticipate.map(data => {
                    return participateBlock(data)
                })
            }
        </div>

        <div className={classes.tableDetail}>
            <DetailTable ido={ido} />
        </div>

    </div >);
}

export default IdoDetail

function participateBlock(props) {
    return (<div key={props.title} className={classes.participateBlock}>
        <div className={classes.imgBlock} >
            <img alt="" src={props.img} style={{ filter: props.date.getTime() < Date.now() ? 'grayscale(1)' : 'none' }} />

        </div>
        <div className={classes.title} > {props.title} </div>
        <div className={classes.text} > {props.text1} </div>
        <div className={classes.text} > {props.text2} </div>
    </div>)
}
