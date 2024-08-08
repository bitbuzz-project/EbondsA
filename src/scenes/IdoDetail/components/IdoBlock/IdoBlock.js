import React, { useState, useEffect } from "react";
import classes from "./IdoBlock.module.scss"
function numberWithCommas(x) {
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
        return d + ' days, ' + h + ' h, ' + m + ' mins'
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

function priceToFormatedPrice(price) {
    return "$" + price
}

export function IdoBlock(props, ido) {

    if (ido === undefined)
        return (<></>)

    return (
        <div className={classes.IdoBlock}>
            <div className={classes.tokenBlock}>
                {tokenInfo(props.token)}
                {priceDetail(props.token)}
            </div>

            <div className={classes.saleInfo}>
                <div className={classes.line} ></div>
                <RoundDetail time_left={ido.current_round === 'Preparing for sale' ? ido.time_until_launch : ido.time_left_in_current_round} current_round={ido.current_round} />
                {progressBar(props.saleInfo)}
                {launchDetaid(props.saleInfo)}
            </div>

        </div>
    )
}

function tokenInfo(props) {
    return (
        <div className={classes.token}>
            <img className={classes.tokenLogo} alt={props.name} src={props.img}  />
            <div className={classes.text}>
                <div className={classes.name}> {props.name} </div>
                <div className={classes.symbol}>{props.symbol}</div>
            </div>
        </div>
    )
}

function priceDetail(props) {
    return (
        <div className={classes.priceDetail}>
            <div className={classes.text}> Price </div>
            <div className={classes.price}> ${props.price} </div>
        </div>
    );
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
    return (<div className={classes.progressBarWrapper}>
        <div className={classes.progressBar} >
            <div className={classes.backPart} ></div>
            <div style={{ width: `${props.info.sale_progres}%` }} className={classes.topPart} ></div>
        </div>
        <div style={{marginLeft: `calc(${Math.min(props.info.sale_progres, 100)}% - 0.75em)`}}>
            <p>Sale</p>
            <p>{props.info.sale_progres}%</p>
        </div>
    </div>
    )
}

function RoundDetail({ time_left, current_round }) {
    let timer;
    const [iTimeLeft, setITimeLeft] = useState(time_left);

    const updateCount = () => {
        timer = !timer && setInterval(() => {
            setITimeLeft(prevCount => prevCount - 1) // new
        }, 1000)
    }

    useEffect(() => {
        updateCount()

        return () => clearInterval(timer)
    }, [])


    return (
        <div className={classes.roundDetail}>
            <div className={classes.block}>
                <div className={classes.text}> Round</div>
                <div className={classes.text}> Time Left </div>
            </div>
            <div className={classes.block}>
                <div className={classes.roundInfo}> {current_round} </div>
                <div className={classes.timeInfo}> {timeLeft(iTimeLeft)} </div>
            </div>
        </div>
    )
}

function launchDetaid(props) {


    return (
        <div className={classes.roundDetail}>
            <div className={classes.block}>
                <div className={classes.text}> Token Distribution </div>
                <div className={classes.text}> Total Raised </div>
            </div>
            <div className={classes.block}>
                <div className={classes.roundInfo}> {props.info.token_distribution} </div>
                <div className={classes.roundInfo}> ${props.totalRaised} </div>
            </div>
        </div>
    )
}