import React from "react";
import classes from "./TableHeader.module.scss"


export function TableHeader(props) {
    return (
        <div className={classes.TableHeader} style={{minWidth: "1176px"}}>
            <div style={{width: "200px", minWidth: "200px", maxWidth: "200px"}} >Project Name</div>
            <div style={{width: "140px", minWidth: "140px", maxWidth: "200px"}}>IDO Token Price</div>
            <div style={{width: "120px", minWidth: "120px", maxWidth: "200px"}}>Current<br/> Price</div>
            <div style={{width: "80px", minWidth: "80px", maxWidth: "200px"}}>ATH</div>
            <div style={{width: "120px", minWidth: "120px", maxWidth: "200px"}}>ATH <br />IDO ROI</div>
            <div style={{width: "150px", minWidth: "150px", maxWidth: "200px"}}>No. <br />Participants</div>
            <div style={{width: "130px", minWidth: "130px", maxWidth: "200px"}}>Total Raised</div>
            <div style={{width: "150px", minWidth: "150px", maxWidth: "200px"}}>Total Tokens Sold</div>
            <div style={{width: "120px", minWidth: "120px", maxWidth: "200px"}}>Sale Ended At</div>
        </div>
    )
}