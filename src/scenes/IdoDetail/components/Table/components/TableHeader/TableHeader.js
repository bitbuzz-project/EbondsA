import React from "react";
import classes from "./TableHeader.module.scss"


export function TableHeader(props) {
    return (
        <div className={classes.TableHeader} style={{}}>
            <div style={{width: "15%", minWidth: "100px"}} >Portion Id</div>
            <div style={{width: "15%", minWidth: "100px", }}>Vested %</div>
            <div style={{width: "20%", minWidth: "100px"}}>Amount</div>
            <div style={{width: "30%", minWidth: "80px"}}>Portion Unlock At</div>
            <div style={{width: "20%", minWidth: "100px"}}>Claim</div>
        </div>
    )
}