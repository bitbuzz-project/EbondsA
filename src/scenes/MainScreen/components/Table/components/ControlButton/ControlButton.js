import React from "react";
import classes from './ControlButton.module.scss'

export function Button(props) {
    return (
        <button
            className={ props.isActive ? classes.styledButtonActive : classes.styledButton}
            onClick={(ev) => { props.onClick(ev) }}>
            {props.text}
        </button>
    )
}