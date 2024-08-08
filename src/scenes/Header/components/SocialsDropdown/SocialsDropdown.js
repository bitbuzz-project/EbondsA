import { IconButton } from '@mui/material';
import { useState } from 'react';
import classes from './SocialsDropdown.module.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SocialsDrowdown = ({ icon, link, linkList }) => {
    const [openDropwdown, setOpenDropdown] = useState(false);



    return (<div className={classes.SocialsDropdown}>
        <IconButton onClick={() => {
            if (!link) {
                setOpenDropdown(!openDropwdown);
            } else {
                window.open(link, "_blank")
            }
        }}>
            {icon}
            {
                !!linkList && <ExpandMoreIcon style={{color: "white"}}/>
            }
            
        </IconButton>
       
        {
            !!linkList && openDropwdown &&
            <ul className={classes.dropdownMenu}>
                {linkList.map((e) => 
                    <li onClick={() => window.open(e.link, "_blank")}><div className={classes.icon}>{icon}</div>{e.text}</li>
                )}
            </ul>

        }
    </div>);
}

export default SocialsDrowdown;