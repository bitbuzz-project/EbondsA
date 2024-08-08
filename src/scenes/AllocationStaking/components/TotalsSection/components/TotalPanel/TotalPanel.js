import { Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import InfoIcon from '../../../StakingStats/images/InfoIcon.svg'

import classes from './TotalPanel.module.scss'

function numberWithCommas(x) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const TotalPanel = ({info}) => {
    const decimals = useSelector(state=>state.userWallet.decimal);
    return (<div className={classes.totalPanel}>
        <div className={classes.header}>
            <div className={classes.title}>{info.title}</div>
            {/* <Tooltip title={info.info} placement={'top'}>
                <img src={InfoIcon} className={classes.infoIcon}/>
            </Tooltip> */}
        </div>
        <div className={classes.body}>
            <div className={classes.value}>{numberWithCommas(info.value.value/Math.pow(10, decimals))} {info.value.append} <span className={classes.valueSubappend}>{info.value.subappend}</span></div>
            <div className={classes.subvalue}> ~{info.subvalue.prepend}{numberWithCommas(parseFloat(info.subvalue.value/Math.pow(10, decimals).toFixed(2)))}</div>
        </div>
    </div>);
}
 
export default TotalPanel;