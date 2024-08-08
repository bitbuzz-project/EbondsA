import React from "react";
import classes from "./TableRow.module.scss"
import LinkImg from './link_img.svg'

export function TableRow(props) {
    return (
        <>
            <div className={classes.tableRow}>
                <div className={classes.text}> {props.text} </div>
                <div className={classes.info}>
                    { props.link ? renderLink(props.link) : props.info }
                </div>
            </div>
            <div className={props.showLine ? classes.line : classes.clear} />
        </>
    )
}

function renderLink(props) {
    return (<div className={classes.link}>
        <div className={classes.img} > 
            <img alt="Link" src={LinkImg} />
        </div>
        <div className={ props.isShortText ? classes.linkTextShort : classes.linkText}>
            {props.text}
        </div>
    </div>)
}