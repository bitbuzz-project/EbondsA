import { useSelector } from 'react-redux';
import InfoIcon from '../../images/InfoIcon.svg'
import Tooltip from '@mui/material/Tooltip';

import classes from './StatsCard.module.scss'

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function valueFormatter(x){
    var width = window.innerWidth;
    if(width<1500 && x>10**11){
        x/=10**6;
        return x.toFixed(2)+'M';
    }
    return x.toFixed(2);
}

const StatsCard = ({ info }) => {
    const decimals = useSelector(state=>state.userWallet.decimal);

    return (<div className={classes.statsCard}>
        <div className={classes.statsTitle}>
            <div className={classes.text}>{info.title}</div> 
            {/* <Tooltip title={info.info} placement={'top'}>
                <img src={InfoIcon} className={classes.titleIcon}/>
            </Tooltip> */}
        </div>

        <div className={classes.contents}>
            {info.value &&
                <div>
                    <div className={classes.val}>
                        {(valueFormatter(info.value/Math.pow(10, decimals)))}{info.append}
                    </div>

                    {info.subvalue && 
                        <div className={classes.subvalue}>
                            {'~' + info.subvalue.append + numberWithCommas(info.append==='' ? (info.subvalue.value/Math.pow(10, decimals)).toFixed(2) : info.subvalue.value )}
                        </div>
                    }
                </div>
            }

            {info.action &&
                <div>
                    {info.action.buttonText &&
                        <button className={classes.actionButton} disabled={!info.action.buttonActive} onClick={info.action.buttonCallback}>{info.action.buttonText} </button>
                    }
                </div>
            }
        </div>
    </div>);
}

export default StatsCard;