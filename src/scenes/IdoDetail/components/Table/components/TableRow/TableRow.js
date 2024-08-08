import React from "react"
import classes from "./TableRow.module.scss"
import {Button} from "../../../ControlButton/ControlButton"

export function TableRow(props, onClick) {
    return (
        // { id: 0, vested: "30%", amount: "????", portion: "Some data"}
        <div className={classes.TableRow} style={{ background:props.color}}>
            <div className={classes.divUpdate} style={{width: "15%", minWidth: "100px"}}> {props.id} </div>
            <div className={classes.divUpdate} style={{width: "15%", minWidth: "100px", }}> {props.vested} </div>
            <div className={classes.divUpdate} style={{width: "20%", minWidth: "100px"}}> {props.amount} </div>
            <div className={classes.divUpdate} style={{width: "30%", minWidth: "80px"}}>{props.portion }</div>
            <div className={classes.divUpdate} style={{width: "20%", minWidth: "100px"}}>
                <Button onClick={() => {props.onClick(props.id)}} isActive={true} text="Claim" />
            </div>
        </div>
    )
}