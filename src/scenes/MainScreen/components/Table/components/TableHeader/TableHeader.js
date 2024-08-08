import React from "react";
import classes from "./TableHeader.module.scss"


export function TableHeader(props) {
    return (
        <div className={classes.TableHeader} style={{maxWidth: '100%', minWidth: "900px"}}>
            <div style={{width: '14%', paddingRight: '1em'}} >Project Name</div>
            <div style={{width: '10%', paddingRight: '1em'}}>IDO Token Price</div>
            <div style={{width: '9%', paddingRight: '1em'}}>Current Price</div>
            <div style={{width: '8%', paddingRight: '1em'}}>ATH</div>
            <div style={{width: '10%', paddingRight: '1em'}}>ATH IDO ROI</div>
            <div style={{width: '12%', paddingRight: '1em'}}>No. Participants</div>
            <div style={{width: '12%', paddingRight: '1em'}}>Total Raised</div>
            <div style={{width: '12%', paddingRight: '1em'}}>Total Tokens Sold</div>
            <div style={{width: '13%', paddingRight: '1em'}}>Sale Ended At</div>
        </div>
    )
}