import { forwardRef } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import classes from './InfoDialog.module.scss'

const DialogTransition = forwardRef(function Transition(props, ref) { return <Slide direction="up" ref={ref} {...props} />; });

const InfoDialog = ({ show, setShow}) => {
    return (
        <>
            <Dialog
                className={classes.dialog}
                open={show}
                TransitionComponent={DialogTransition}
            >
                <DialogTitle>
                    <h2 className={classes.dialogTitle}>
                        Allocation Staking
                    </h2>
                </DialogTitle>

                <DialogContent>
                    <p>EBONDS.Finance Staking Mechanism Overview:</p>                
                    <p>
                    1. Token Staking:
Users can actively participate in the EBONDS.Finance ecosystem by purchasing and staking EBONDS, our core contribution token. Staking EBONDS is not just an investment; it's a strategic move to engage with our dynamic DeFi platform.
         
 </p>
 <p>
                    2. ESIR Token Rewards:
For every 1000 EBONDS staked, users are rewarded with 1 ESIR token daily. This innovative reward system ensures proportional and fair distribution, aligning with our commitment to transparency and longterm sustainability.
 </p>
 <p>
                    3. Continuous Rewards:
ESIR rewards are distributed daily, with the fractionalization process synchronized with block rewards. This consistent and frequent distribution mechanism ensures that our community members can enjoy the benefits of their staked EBONDS regularly.
 </p>
 <p>
                    4. Fee Generation and Compounding:
EBONDS.Finance leverages a sophisticated fee generation mechanism. Fees generated from our DeFi Treasury, blue-chip investments, and altcoin liquidity pools are strategically compounded. This compounding strategy creates a positive flywheel effect, amplifying our ability to generate more fees over time.
 </p>
 <p>
                    5. Sustainable Buyback Strategy:
A key element of our ecosystem is the sustainable buyback strategy. Generated fees are utilized not only to compound returns but also to execute buybacks of both EBONDS and ESIR tokens. This strategic approach is designed to maintain sustainable token levels and contribute to the long-term viability of our platform.
 </p>
            
                    <p>
                        <b>
                        At EBONDS.Finance, we believe in creating a dynamic and rewarding staking experience for our community. Join us in the journey to stake, earn ESIR rewards, and actively contribute to the positive flywheel that drives the sustainable growth of our decentralized financial ecosystem.                    </b>
                    </p>
                </DialogContent>

                <DialogActions className={classes.actions}>
                    <button className={classes.closeButton} onClick={()=>setShow(false)}>Close</button>
                </DialogActions>


            </Dialog>
        </>
    );
}

export default InfoDialog;