import Table from '../MainScreen/components/Table/Table';
import classes from './AdminPanel.module.scss'
import SalesForm from './components/Form/SalesForm';
import { BsChevronDown } from "react-icons/bs";
import { Button, Tab, Tabs } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { useState } from 'react';
import Collapsible from 'react-collapsible';    
import UpcomingTable from './components/UpcomingTable/UpcomingTable';
import AuthDialog from './components/AuthDialog/AuthDialog';
import { logout } from './components/AuthDialog/API/adminPanelAuth';
import session from 'redux-persist/lib/storage/session';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"; 
import { setSelectedIDO } from '../../features/adminPageSlice';
import AbiConstructor from '../AbiConstructor/AbiConstructor';

const AdminPanel = () => {

    const selectedIDO = useSelector(state => state.adminPage.selectedIDO)
    const [showDialog, setShowDialog] = useState(sessionStorage.getItem('adminAuth') ? sessionStorage.getItem('adminAuth')==='false' : true);
    const [tab, setTab] = useState('web_data');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (<>
        <div className={classes.adminPanel}>

            <header>
                <h1 className={classes.mainText}>ADMIN PANEL</h1>
                <div className={classes.buttons}>
                    <div className={classes.infoButton} onClick={() => {
                        logout();
                        sessionStorage.setItem('adminAuth', false);
                        navigate('/');
                    }}>
                        Log out
                    </div>

                    <div className={classes.infoButton} onClick={()=>dispatch(setSelectedIDO({}))}>
                        Create IDO
                    </div>
                </div>
            </header>

            <section>
                {   
                    selectedIDO != null ?
                        <div className={classes.formSection}>

                            <Tabs
                                value={tab}
                                onChange={(e, value)=>{
                                    setTab(value);
                                }}
                                
                            >
                                <Tab 
                                    value="web_data"
                                    label="Web data"
                                />

                                <Tab 
                                    value="contract_data"
                                    label="Contract data"
                                />

                            </Tabs>

                            <div>
                                { <div style={{display: tab==='web_data'? '' : 'none' }}><SalesForm/></div>}
                                { <div style={{display: tab==='contract_data'? '' : 'none' }}><AbiConstructor/></div>}
                            </div>
                            
                        </div>
                        :
                        <div className={classes.tablesSection}>
                            <div className={classes.tableDiv}>
                                <Collapsible
                                    trigger={["Completed IDOs", <BsChevronDown />]}
                                    triggerClassName={classes.collapsibleHeader}
                                    triggerOpenedClassName={classes.collapsibleHeaderisOpen}
                                    openedClassName={classes.collapsibleContent}
                                >
                                    <Table />
                                </Collapsible>
                            </div>

                            <div className={classes.tableDiv}>
                                <Collapsible
                                    trigger={["Ogoing IDOs", <BsChevronDown />]}
                                    triggerClassName={classes.collapsibleHeader}
                                    triggerOpenedClassName={classes.collapsibleHeaderisOpen}
                                    openedClassName={classes.collapsibleContent}
                                    
                                >
                                    <Table ongoing={true} />
                                </Collapsible>
                            </div>

                            <div className={classes.tableDiv}>
                                <Collapsible
                                    trigger={["Upcoming IDOs", <BsChevronDown />]}
                                    triggerClassName={classes.collapsibleHeader}
                                    triggerOpenedClassName={classes.collapsibleHeaderisOpen}
                                    openedClassName={classes.collapsibleContent}
                                    
                                >
                                    <Table upcoming={true} />
                                </Collapsible>
                            </div>

                            
                        </div>
                }
                


            </section>

        </div>
        <AuthDialog show={showDialog} setDialog={setShowDialog}/>
    </>);
}

export default AdminPanel;