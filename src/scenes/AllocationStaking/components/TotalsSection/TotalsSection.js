import TotalPanel from './components/TotalPanel/TotalPanel';
import classes from './TotalSection.module.scss'
import TotalIcon from './images/Total.svg'

const TotalsSection = ({ content }) => {
    return (<>


        <div className={classes.totalSection}>
            <div className={classes.totalsHeader}>
                {/* <img className={classes.headerIcon} src={TotalIcon} /> */}
                <div className={classes.headerText}>
                    Total Stats
                </div>
            </div>
            <div className={classes.totalContent}>
                {content.map((info, index) => <TotalPanel info={info} key={"total_panel" + index} />)}
            </div>
        </div>
    </>);
}

export default TotalsSection;