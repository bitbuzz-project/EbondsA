import React from "react";
import classes from "./ControlButton.module.scss"


export function ControlButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={props.isActive ? classes.ActiveButton : classes.Button}
        > {props.text} </button>
    )
}