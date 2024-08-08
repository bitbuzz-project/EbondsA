import StatsCard from './components/StatsCard/StatsCard';
import StakingStatsIcon from './images/StakingStats.svg'

import classes from './StakingStats.module.scss'

const StakingStats = ({content}) => {
    return (
        <div className={classes.stakingStats}>
            <div className={classes.statsHeader}>
                {/* <img className={classes.headerIcon} src={StakingStatsIcon} /> */}
                <div className={classes.headerText}>
                    Staking Stats
                </div>
            </div>

            <div className={classes.statsContent}>
                {
                    content.map((card, index)=><StatsCard info={card} key={'stats_card'+index}/>)
                }
            </div>
        </div>
    );
}

export default StakingStats;