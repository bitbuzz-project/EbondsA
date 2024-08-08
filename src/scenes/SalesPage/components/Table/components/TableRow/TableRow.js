import {useState} from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { setSelectedIDO } from "../../../../../../features/adminPageSlice";
import classes from "./TableRow.module.scss"

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }else if(num < 900){
        return num; // if value < 1000, nothing to do
    }
}

export const TableRow = (props, ongoing, navigate)=> {
    
    const endAt = new Date(props.endAt*1000);

    return (
        <div className={classes.TableRow} style={{maxWidth: '100%', minWidth: "900px", background:props.color}} onClick={()=>navigate('/project-details?id='+props.id)} >
            <div className={classes.infoBlock} style={{ width: '14%'}} >
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
            <div className={classes.divUpdate} style={{width: ongoing ? '15%' : '10%'}}> {'$'+props.idoPrice} </div>
            <div className={classes.divUpdate} style={{width: ongoing ? '15%' : '9%'}}> {'$' + props.currentPrice.toFixed(3)} </div>
            {!ongoing && <div className={classes.divUpdate} style={{width: '8%'}}>{'$' + props.ath.toFixed(3) }</div> }
            {!ongoing && <div className={classes.divUpdate} style={{width: '10%'}}>{ props.roi.toFixed(3) + 'x' }</div>}
            <div className={classes.divUpdate} style={{width: '12%'}}>{ numFormatter(props.partisipants) }</div>
            <div className={classes.divUpdate} style={{width: '12%'}}>{ '$' + numberWithCommas(Math.round(props.totalRaised))} </div>
            <div className={classes.divUpdate} style={{width: ongoing ? '18%' :'12%'}}> {numFormatter(Math.round(props.totalTokenSold))} </div>
            <div className={classes.divUpdate} style={{width: '13%'}}> {endAt.toLocaleString('en-US', {dateStyle: 'long'})} </div>
        </div>
    )
}