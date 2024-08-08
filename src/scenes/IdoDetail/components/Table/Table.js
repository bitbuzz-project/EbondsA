import React, { useEffect, useState } from "react";
import classes from "./Table.module.scss"
import { TableHeader } from "./components/TableHeader/TableHeader";
import { TableRow } from "./components/TableRow/TableRow";
import Img from './test_img.svg'
import { ethers, BigNumber } from "ethers";
import { SALE_ABI } from "../../../../consts/abi";
import { useSelector } from "react-redux";

const Table = ({onClick, mainIdo}) => {
    const [activeType, setActiveType] = useState(0);
    const [rotateRate, setRotateRate] = useState(0);
    const [info, setInfo] =useState([
    ]);

    const { ethereum } = window;
    const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;
    const signer = provider ? provider.getSigner() : null;
    const [saleContract, setSaleContract] = useState(signer ? new ethers.Contract(mainIdo.contract_address, SALE_ABI, signer): null);

    const userWalletAddress = useSelector(state=>state.userWallet.address);

    useEffect(()=>{
        if(mainIdo===undefined || !signer)
            return;
        
        
        
        setSaleContract(new ethers.Contract(mainIdo.contract_address, SALE_ABI, signer));
        setInfo(mainIdo.project_detail.vesting_percent.map((e, index)=>{
            return{
                id: index, 
                vested: e+'%',
                amount: "Calculating...",
                portion: new Date(mainIdo.project_detail.vesting_time[index]*1000).toLocaleDateString('en-GB')
            }
        }))
    }, [mainIdo])

    useEffect( async ()=>{
        if(info.length===0 || !saleContract || !userWalletAddress)
            return;

        let t_info = [...info];
        for(let i =0; i<t_info.length; i++){
            console.log('cycling htrou')
            await saleContract.calculateAmountWithdrawingPortionPub(userWalletAddress, BigNumber.from(mainIdo.project_detail.vesting_percent[i])).then((response)=>{
                t_info[i].amount = response.toString();
            });
        }

        setInfo([...t_info]);
    }, [saleContract, userWalletAddress])
    
    return (  <>
        <div className={classes.Table}>
            <TableHeader />
            
            {
                info.map((ido, index) => {
                    ido.color = index % 2 ? "linear-gradient(rgb(10, 167, 245, 0.1) 0%, rgb(60, 231, 255, 0.1) 100%)" : "#FFFFFF"
                return <TableRow {...ido} onClick={(id) => {onClick(id)}} />
                } )
            }

            {
                info.length===0 && 
                <h2 className={classes.emptyMessage}> You have not made any allocations yet </h2>
            }
        </div>
    </>);
}
 
export default Table;