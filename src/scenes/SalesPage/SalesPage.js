import {useState} from 'react';
import InfoPanel from './components/InfoPanel/InfoPanel';

import Table from './components/Table/Table'
import classes from './SalesPage.module.scss'

const SalesPage = () => {
    const [info, setInfo] = useState([
        {
            title: 'Fair and Equitable Fundraising',
            text: 'Our unique staking and distribution methodology ensures broad participation.'
        },

        {
            title: 'Vesting and Distribution',
            text: 'The first launchpad to allow holders to grow with the network, regardless of participation.'
        },
        {
            title: 'Permissionless Listings',
            text: 'Our emphasis on people and teams creates strong starts for new projects.'
        }
    ]);
    
    return (<div className={classes.salesPage}>
        <h1 className={classes.pageHeader}>PEAKDEFI <br /> Launchpad Sales</h1>
        <div>
            <h1 className={classes.tableHeaders}>Ongoing sales</h1>
            <Table upcoming={true} ongoing/>
        </div>
        
        <div>
            <h1 className={classes.tableHeaders}>Completed Sales</h1>
            <Table></Table>
        </div>

        <div className={classes.infoPanels}>
            {
                info.map(el=><InfoPanel content={el} key={el.title}/>)
            }
        </div>
        
    </div>);
}

export default SalesPage;