import { useState } from 'react';
import classes from './MediaLinks.module.scss';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import telegram from '../../../../../src/resources/telegram.svg';
import discord from '../../../../../src/resources/discord.svg';
import twitter from '../../../../../src/resources/twitter.svg';

const MediaLinks = () => {
    const [mediaLinks, setMediaLinks] = useState([
     
        {
            icon: <img src={discord} alt="Discord" style={{ fill: 'white' }} />, // Change color to white
            link: "https://discord.gg/vM4YC6WxSd" // Replace with your actual link
        },
        {
            icon: <img src={twitter} alt="Twitter" style={{ fill: 'white' }} />, // Change color to white
            link: "https://twitter.com/EbondsFinance" // Replace with your actual link
        },
        // ...other objects
    ]);

    return (
        <div className={classes.MediaLinks}>
            <div className={classes.media}>
                {mediaLinks.map((media, index) => (
                    <a key={index} href={media.link}>
                        {media.icon}
                    </a>
                ))}
                <div className={classes.verticalSeparator}></div>
            </div>
        </div>
    );
};

export default MediaLinks;
