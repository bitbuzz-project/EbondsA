import React, { useEffect, useState } from 'react'
import classes from "./Header.module.scss"
import { useWeb3React } from '@web3-react/core'
import CloseIcon from '@mui/icons-material/Close';
import { getUserDataKYC } from './API/blockpass';



export function Blockpass(props) {
    const [showVerify, setShowVerify] = useState(false); //change to false
    const [isPending, setIsPending] = useState(false);

    const { activate, deactivate, account, error } = useWeb3React();
    useEffect(() => {
        loadBlockpassWidget()
    })

    const loadBlockpassWidget = () => {
        const blockpass = new window.BlockpassKYCConnect(
            'peakdefi_launchpad_c0f15', // service client_id from the admin console
            {
                env: 'prod',
                refId: account
            }
        )
        
        blockpass.startKYCConnect()
    }

    useEffect(async () => {
        if(account===undefined)
            return;

        try {
            await getUserDataKYC(account).then(response => {
                if (response.data.data.status === "approved") {
                    setShowVerify(false);
                } else {
                    setIsPending(true);
                    setShowVerify(true);
                }
            }).catch(error => {
                setIsPending(false);
                setShowVerify(true);
            } )
        } catch (error) {
            setShowVerify(true);
        }
    }, [account])

    return (
        <div className={account ? classes.kyc : classes.hide} style={{display: showVerify ? '': 'none'}}>
            
            <div className={classes.text} style={{display: isPending ? "none" : ""}}>
                
                <div> You need to verify your KYC before participate sale </div>
                <button id="blockpass-kyc-connect">
                    Verify with Blockpass
                </button>
            </div>

            {isPending && 
                <div className={classes.greentext}> Blockpass verification pending. Once it's complete you can participate in sales </div>
            }



            <button className={classes.closeButton} onClick={() => { setShowVerify(false) }}><CloseIcon /></button>

        </div>
    )
}