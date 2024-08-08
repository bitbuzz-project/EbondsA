import React, { useEffect } from "react";
import classes from "./AllocationsInfo.module.scss"
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers';

import { SALE_ABI } from '../../../../consts/abi'
import { ControlButton } from "../DetailTable/components/ControlButton/ControlButton";

import Table from "../Table/Table";
import { toast } from "react-toastify";

export function AllocationsInfo({ido}) {
    const { activate, deactivate, account, error } = useWeb3React();
    const { ethereum } = window;
    const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) :null;
    const signer = provider ? provider.getSigner() : null;
    const saleContract = signer?  new ethers.Contract(ido.contract_address, SALE_ABI, signer) :null;

    const claimAllAvailablePortions = async (ids) => {
       try {
           let result = await saleContract.withdrawMultiplePortions([0, 1, 2])
           console.log("result",result)
       } catch (error) {
           toast.error('Execution reverted');
       }
    }

    
    const claimPortion = async (id) => {
       try {
           let result = await saleContract.withdrawTokens(id)
           console.log("result",result)
       } catch (error) {
           alert(error.data.message.replace("execution reverted: ", ""))
       }
    }

    return (
        <div className={classes.allocationsInfo}>
            <ControlButton onClick={() => { claimAllAvailablePortions()}} text="Claim all portions" />
            <Table onClick={(id) => { claimPortion(id) } } mainIdo={ido}/>
        </div>
    )
}
