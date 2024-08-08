import React, { useEffect, useState } from "react";
import classes from "./IDO.module.scss"
import TestImg from './test_img.svg'
import { IdoBlock } from './components/IdoBlock/IdoBlock'
import { UpcomingIdoBlock } from './components/UpcomingIdoBlock/UpcomingIdoBlock'
import { OngoingIdo } from './components/OngoingIdo/OngoingIdo';
import Table from "../Table/Table";
import { getUpcomingIdos } from "./API/upcomingIDOs";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


const IDO = ({ props }) => {
    const [idos, setIdos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [upcomingIdos, setUpcomingIdos] = useState([]);
    const [endedIdos, setEndedIdos] = useState([]);
    const [ongoingIdos, setOngoingIdos] = useState([]);
    const navigate = useNavigate();
    const [displayIndex, setDisplayIndex] = useState(0);

    const showCompleted = false; //set to true if you want to return completed IDOs tab on the main screen

    useEffect(() => {
        setIsLoading(true);
        getUpcomingIdos().then((response) => {
            setIsLoading(false);

            setUpcomingIdos([...response.data.upcoming.map(
                e => {
                    return {
                        id: e.id,
                        heading_text: e.heading_text,
                        website: e.website_url,
                        socials: e.socials,
                        short_description: e.short_description,
                        token: {
                            name: e.token.name,
                            symbol: e.token.symbol,
                            img: e.logo_url,
                            price: parseFloat(e.token.current_token_price)
                        },
                        saleInfo: {
                            totalRaised: e.target_raised,
                            raised: parseFloat(e.token.total_raise).toFixed(2),
                            partisipants: e.number_of_participants,
                            start_date: new Date(e.timeline.sale_start * 1000),
                            token_price: e.current_price,
                            time_until_launch: e.time_until_launch,
                            end_date: e.timeline.sale_ends,

                            info: {
                                time_until_launch: null,
                                token_sold: Math.round(parseFloat(e.token.total_tokens_sold)),
                                token_distribution: e.token.token_distribution,
                                sale_progres: e.percent_raised
                            }
                        },
                        bg_image: e.project_detail.project_bg,
                        timeline: e.timeline
                    }
                }
            )]);

            setEndedIdos(response.data.ended.map(
                e => {
                    return {
                        id: e.id,
                        token: {
                            name: e.token.name,
                            symbol: e.token.symbol,
                            img: e.logo_url,
                            price: parseFloat(e.token.current_token_price)
                        },
                        saleInfo: {
                            totalRaised: e.target_raised,
                            raised: parseFloat(e.token.total_raise).toFixed(2),
                            partisipants: e.number_of_participants,
                            start_date: new Date(e.timeline.sale_start * 1000),
                            token_price: e.current_price,
                            time_until_launch: e.time_until_launch,
                            end_date: e.timeline.sale_ends,

                            info: {
                                time_until_launch: null,
                                token_sold: Math.round(parseFloat(e.token.total_tokens_sold)),
                                token_distribution: e.token.token_distribution,
                                sale_progres: e.percent_raised
                            }
                        },
                        bg_image: e.project_detail.project_bg,
                        timeline: e.timeline
                    }
                }
            ));

            setOngoingIdos(response.data.ongoing.map(
                e => {
                    return {
                        id: e.id,
                        token: {
                            name: e.token.name,
                            symbol: e.token.symbol,
                            img: e.logo_url,
                            price: parseFloat(e.token.current_token_price)
                        },
                        saleInfo: {
                            totalRaised: e.target_raised,
                            raised: parseFloat(e.token.total_raise).toFixed(2),
                            partisipants: e.number_of_participants,
                            start_date: new Date(e.timeline.sale_start * 1000),
                            token_price: e.current_price,
                            time_until_launch: e.time_until_launch,
                            end_date: e.timeline.sale_ends,

                            info: {
                                time_until_launch: null,
                                token_sold: Math.round(parseFloat(e.token.total_tokens_sold)),
                                token_distribution: e.token.token_distribution,
                                sale_progres: e.percent_raised
                            }
                        },
                        bg_image: e.project_detail.project_bg,
                        timeline: e.timeline
                    }
                }
            ));

            setIdos(response.data.upcoming.map(
                e => {
                    return {
                        id: e.id,
                        socials: e.socials,
                        website: e.website_url,
                        heading_text: e.heading_text,
                        token: {
                            name: e.token.name,
                            symbol: e.token.symbol,
                            img: e.logo_url,
                            price: parseFloat(e.token.current_token_price)
                        },
                        saleInfo: {
                            totalRaised: e.target_raised,
                            raised: parseFloat(e.token.total_raise).toFixed(2),
                            partisipants: e.number_of_participants,
                            start_date: new Date(e.timeline.sale_start * 1000),
                            token_price: e.current_price,
                            time_until_launch: e.time_until_launch,
                            end_date: e.timeline.sale_ends,

                            info: {
                                time_until_launch: null,
                                token_sold: Math.round(parseFloat(e.token.total_tokens_sold)),
                                token_distribution: e.token.token_distribution,
                                sale_progres: e.percent_raised
                            }
                        },
                        bg_image: e.project_detail.project_bg,
                        timeline: e.timeline
                    }
                }
            ));




        })
    }, []);


 
    return (<div style={{ marginBottom: "40px" }}>

        <Element name="ongoingSale">

            {ongoingIdos.length > 0 && <div className={classes.ongoing}>
                <h1 className={classes.title}>Ongoing Sales</h1>

                <div className={classes.ongoingIdos}>
                    {
                        ongoingIdos.map((ido_data, index) => {
                            if (window.screen.width <= 1000) {
                                return <IdoBlock props={ido_data} key={"ido_data" + index}></IdoBlock>
                            }

                            return <OngoingIdo props={ido_data} key={"ido_data" + index}></OngoingIdo>
                        })
                    }
                </div>
            </div>}
        </Element>

        <div className={classes.menu}>
            <div
                onClick={() => { setIdos([...upcomingIdos]); setDisplayIndex(0); }}
                className={displayIndex === 0 ? classes.menuElementActive : classes.menuElement}>
                Upcoming IDOs
                <div className={displayIndex === 0 ? classes.line : classes.clear}></div>
            </div>
            {
                showCompleted && <div
                    onClick={() => { setIdos([...endedIdos]); setDisplayIndex(1); }}
                    className={displayIndex === 1 ? classes.menuElementActive : classes.menuElement}>
                    Completed IDOs
                    <div className={displayIndex === 1 ? classes.line : classes.clear}></div>
                </div>
            }

        </div>



        <div 
            className={displayIndex === 1 ? classes.idos : classes.upidos} 
            style={{ justifyContent: idos.length <3 ? 'flex-start !important' : 'space-between' }}
        >
            {
                idos.length === 0 &&
                <div className={classes.emptyArrays}>
                    {isLoading && <CircularProgress color="inherit" />}
                    {!isLoading && <p>No IDOs to display</p>}
                </div>
            }

            {

                displayIndex === 1 &&
                endedIdos.map((ido_data, index) => {
                    return <IdoBlock props={ido_data} key={"ido_data" + index}></IdoBlock>
                })
            }

            {
                displayIndex === 0 &&
                [...upcomingIdos].map((ido_data, index) => {
                    return <UpcomingIdoBlock props={ido_data} key={"ido_data" + index}></UpcomingIdoBlock>
                })
            }

        </div>

    </div>);
}

export default IDO;