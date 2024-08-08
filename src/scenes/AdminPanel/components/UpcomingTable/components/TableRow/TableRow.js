import React from "react"
import { useDispatch } from "react-redux";
import { setSelectedIDO } from "../../../../../../features/adminPageSlice";
import classes from "./TableRow.module.scss"

function numberWithCommas(x) {
    if(x)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return '';
}

export function TableRow(props) {
    const endAt = new Date(props.endAt*1000);

    const dispatch = useDispatch();
    return (
        <div className={classes.TableRow} style={{minWidth: "1176px", background:props.color}} onClick={()=>dispatch(setSelectedIDO({...props}))}>
            <div className={classes.infoBlock} style={{ width: "200px", minWidth: "200px", maxWidth: "200px" }} >
                <img alt={props.name} src={props.img} />
                <div className={classes.info}>
                    <div className={classes.name}>
                        {props.name}
                    </div>
                    <div className={classes.symbol}>
                        {props.symbol}
                    </div>
                </div>
            </div>
            <div className={classes.divUpdate} style={{width: "140px", minWidth: "140px", maxWidth: "200px"}}> {'$'+props.idoPrice} </div>
            <div className={classes.divUpdate} style={{width: "120px", minWidth: "120px", maxWidth: "200px"}}> {'$' + props.currentPrice} </div>
            <div className={classes.divUpdate} style={{ width: "80px", minWidth: "80px", maxWidth: "200px" }}>{'$' + props.ath }</div>
            <div className={classes.divUpdate} style={{ width: "120px", minWidth: "120px", maxWidth: "200px" }}>{ props.roi.toFixed(3) + 'x' }</div>
            <div className={classes.divUpdate} style={{ width: "150px", minWidth: "150px", maxWidth: "200px" }}>{ props.partisipants }</div>
            <div className={classes.divUpdate} style={{ width: "130px", minWidth: "130px", maxWidth: "200px" }}>{ '$' + numberWithCommas(props.totalRaised)} </div>
            <div className={classes.divUpdate} style={{width: "150px", minWidth: "150px", maxWidth: "200px"}}> {props.totalTokenSold} </div>
            <div className={classes.divUpdate} style={{width: "120px", minWidth: "120px", maxWidth: "200px"}}> {endAt.toLocaleString('en-US', {dateStyle: 'long'})} </div>
        </div>
    )
}