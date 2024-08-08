import classes from './GiveawayPanel.module.scss'
import Dialog from '@mui/material/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Logo from '../../../../resources/logo_white.svg'


const useStyles = makeStyles(theme => ({
    dialogPaper: {

        minWidth: '50vw'
    },
}));

const GiveAwayPanel = ({ show, setShow }) => {
    return (
        <Dialog
            open={show}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={'md'}
            fullWidth={true}
        >
            <div className={classes.giveawayPanel}>
                <div className={classes.gradientSection}>
                    <img src={Logo} className={classes.logo}/>
                </div>


                <div className={classes.contentSection}>
                    <h1>Win 500'000 PEAK tokens</h1>
                    <p>And be among the first to use Peakdefi Launchpad</p>
                    <form id='signup_form' className={classes.subscribeForm}>
                        <input className={classes.email} type="email" id="email" name="email" />
                        <input className={classes.submit} type="submit" value="Subscribe" />
                    </form>

                    <div className={classes.actions}>
                        <Button onClick={() => setShow(false)} autoFocus>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>


        </Dialog>
    );
}

export default GiveAwayPanel;