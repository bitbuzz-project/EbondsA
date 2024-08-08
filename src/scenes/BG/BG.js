import React, { useEffect, useState } from "react";
import classes from "./BG.module.scss"
import BG_img from '../../resources/bg_gradient.svg'
import wave from './images/wave.svg';
import BG2_img from '../../resources/bg2_gradient.svg'
import { useSelector } from 'react-redux';
import Waves from "./components/Waves/Waves";


const BG = () => {
    const [bgimg, setbgImg] = useState(BG_img);
    const projectDetailBG = useSelector(state => state.projectDetails.bg_image);
    const [isProjectDetails, setIsProjectDetails] = useState(false);

    useEffect(() => {
        if (window.location.href.indexOf('project-details') >= 0) {
            setbgImg(projectDetailBG);
            setIsProjectDetails(true);
        }
        else if(window.location.href.indexOf('sales') >= 0){
            setbgImg(BG2_img);
            setIsProjectDetails(false);
        } 
        else {
            setbgImg(BG_img);
            setIsProjectDetails(false);
        }
    }, [window.location.href]);

    useEffect(()=>{
        if (window.location.href.indexOf('project-details') >= 0) {
            setbgImg(projectDetailBG);
            setIsProjectDetails(true);
        }
        else{
            setbgImg('');
        }
    }, [projectDetailBG]);

    return (
        <div className={classes.BG}>

            {isProjectDetails &&
                <>
                    <img src={bgimg} className={classes.bgimg} style={{filter: isProjectDetails? 'brightness(50%)' : ''}}/>
                    {/* {
                        window.location.href.indexOf('project-details') >= 0 &&
                        <img src={wave} className={classes.wave}/>
                    } */}
                </>
            }

            {!isProjectDetails && <Waves bgimg={bgimg} isProjectDetails={isProjectDetails}/>}

        </div>
    );
}

export default BG;