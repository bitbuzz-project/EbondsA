import React from "react";
import classes from "./TableHeader.module.scss"


export function TableHeader({ongoing}) {
    return (
        <div className={classes.TableHeader} style={{maxWidth: '100%', minWidth: "900px"}}>
            <div style={{width: '14%'}} >Project Name</div>
            <div style={{width: ongoing ? '15%' : '10%'}}>IDO Token Price</div>
            <div style={{width: ongoing ? '15%' : '9%'}}>Current Price</div>
            {!ongoing && <div style={{width: '8%'}}>ATH</div>}
            {!ongoing &&<div style={{width: '10%'}}>ATH IDO ROI</div>}
            <div style={{width: '12%'}}>No. Participants</div>
            <div style={{width: '12%'}}>Total Raised</div>
            <div style={{width: ongoing ? '18%' :'12%'}}>Total Tokens Sold</div>
            <div style={{width: '13%'}}>{ongoing ? "Sale Ends At" : "Sale Ended At" }</div>
        </div>
    )
}