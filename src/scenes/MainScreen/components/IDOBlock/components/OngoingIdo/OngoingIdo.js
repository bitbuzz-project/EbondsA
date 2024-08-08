import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./OngoingIdo.module.scss"
import {useDispatch} from 'react-redux'
import { setBG } from "../../../../../../features/projectDetailsSlice";

function numberWithCommas(x) {
    if (!x)
        return 0;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeToDate(time) {
    let date = new Date(time * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime
}

function timeLeft(seconds) {

    let timeString = '';
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    if (d > 0) {
        return d + ' days ' + h + 'hours'
    }
    else if (h > 0) {
        return h + ' hours ' + m + ' minutes';
    }
    else if (m > 0 || s > 0) {
        return m + ":" + s;
    } else {
        return 'Launched';
    }

}

function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}

function priceToFormatedPrice(price) {
    return "$" + price.toFixed(3)
}

export function OngoingIdo({ props }) {
    const [seconds, setSeconds] = useState(typeof props.saleInfo.time_until_launch === 'string' ? 0 : props.saleInfo.time_until_launch);
    let timer;
    
    
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const updateCount = () => {
        timer = !timer && setInterval(() => {
            setSeconds(prevCount => prevCount - 1) // new
        }, 1000)
    }

    useEffect(() => {
        updateCount()

        return () => clearInterval(timer)
    }, []);

    const start_date = props.saleInfo.start_date ? ("0" + props.saleInfo.start_date.getDate()).slice(-2) + "." + ("0" + (props.saleInfo.start_date.getMonth() + 1)).slice(-2) + "." +
        props.saleInfo.start_date.getFullYear() : '';

    return (
        <div className={classes.IdoBlock} onClick={() => {
            navigate('/project-details?id=' + props.id);
            dispatch(setBG(props.bg_image));
        }}>
            <header>

                <img className={classes.bgImage} src={props.bg_image}/>

                <div className={classes.tokenBlock}>
                    {tokenInfo(props.token)}
                    
                </div>
            </header>

            <main>
                <div className={classes.saleInfo}>
                    {totalRaised(props.saleInfo)}
                    <div className={classes.textToShowBlock} >
                        {textToShow("Participants", props.saleInfo.partisipants)}
                        {textToShow("Start Date", start_date)}
                        {textToShow("Token Price", isNaN(props.token.price) ? 'TBA' : priceToFormatedPrice(props.token.price))}
                    </div>

                </div>

                <div className={classes.verticalSeparator}></div>

                <div className={classes.details}>

                    <div className={classes.launchDetaid}>
                        <div className={classes.block}>
                            <div className={classes.subBlock}>
                                <div className={classes.text}> Time Until Launch </div>
                                <div style={{ marginTop: "10px" }} className={classes.value}> {timeLeft(seconds)}</div>
                            </div>

                            <div className={classes.subBlock}>
                                <div className={classes.text}> Token Sold: </div>
                                <div className={classes.value}> {numFormatter(props.saleInfo.info.token_sold)} </div>
                            </div>
                        </div>
                        <div className={classes.block}>
                            
                            <div className={classes.subBlock}>
                                <div className={classes.text}> Token Distribution:</div>
                                <div className={classes.value}> {numFormatter(props.saleInfo.info.token_distribution)} </div>
                            </div>

                            <div className={classes.subBlock}>
                                <div className={classes.text}> Sale progress </div>
                                <div style={{ marginTop: "10px" }} className={classes.value}> {props.saleInfo.info.sale_progres}%</div>

                            </div>
                        </div>
                    </div>

                    {progressBar(props.saleInfo)}
                </div>
            </main>
        </div>
    )
}

function tokenInfo(props) {
    return (
        <div className={classes.token}>
            <img alt={props.name} src={props.img} height={"80"} />
            <div className={classes.text}>
                <div className={classes.name}> {props.name} </div>
            </div>
        </div>
    )
}

function totalRaised(props) {
    return (
        <div className={classes.totalRaised}>
            <div className={classes.text}>Total Raised</div>
            <div className={classes.count}>
                ${numberWithCommas(Math.round(props.raised))}/${numberWithCommas(props.totalRaised)}
            </div>
        </div>
    )
}

function textToShow(text, value) {
    return (
        <div className={classes.textToShow}>
            <div className={classes.text}>{text}</div>
            <div className={classes.value}>{value}</div>
        </div>
    )
}

function progressBar(props) {
    return (
        <div className={classes.progressBar} >
            <div className={classes.backPart} ></div>
            <div style={{ width: `${props.info.sale_progres}%` }} className={classes.topPart} ></div>
        </div>
    )
}
