import React, { useState, useEffect } from 'react';
import classes from "./MainInfo.module.scss"
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers';

import { SALE_ABI, TOKEN_ABI } from '../../../../consts/abi';

import { useSelector } from 'react-redux'
import { tokenContractAddress } from '../../../AllocationStaking/components/StakeCard/services/consts';
import { getUserDataKYC } from '../../../Header/API/blockpass';
import { toast } from 'react-toastify';


export function MainInfo(props) {
    const { activate, deactivate, account, error } = useWeb3React();

    const { ethereum } = window;
    const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;
    const signer = provider ? provider.getSigner() :null ;
    const [saleContract, setSaleContract] = useState();
    const tokenContract = signer ? new ethers.Contract(tokenContractAddress, TOKEN_ABI, signer) : null;
    const [amount, setAmount] = useState(0);
    const userWalletAddress = useSelector((state) => state.userWallet.address)
    const [allowance, setAllowance] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [maxAmount, setMaxAmount] = useState(2500);
    const { id } = props.ido ?? 0;

    useEffect(()=>{
        console.log("USER IS REGISTERED: " + isRegistered)
    }, [isRegistered]);

    useEffect(async () => {
        if (userWalletAddress) {
            const lsaleContract = new ethers.Contract(props.ido.contract_address, SALE_ABI, signer)
            
            setSaleContract(lsaleContract);
         
            isRegisteredCheck(lsaleContract);

            tokenContract.allowance(userWalletAddress, props.ido.contract_address).then((response) => {
                setAllowance(parseInt(response.toString()));
            })
            .catch((erorr) => {
                console.log(error);
            });
        }

    }, [userWalletAddress, props.ido.contract_address])



    useEffect(async () => {
        try {
            await getUserDataKYC(account).then(response => {
                if (response.data.data.status === "approved") {
                    setShowVerify(false);
                } else {
                    setShowVerify(true);
                }
            }).catch(error => {
                 setShowVerify(true);
            } )
        } catch (error) {
            setShowVerify(true);
        }
    }, [account])

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

    const registerForSale = async () => {
        try {
            saleContract.registerForSale().then(res=>{
          
                const transaction = res.wait().then(tran=>{
                    setIsRegistered(true);
                });

                toast.promise(
                    transaction,
                    {
                        pending: "Registration pending",
                        success: 'Registration completed',
                        error: 'Registration failed'
                    }
                )
            })
            
            //alert("Hash " + result.hash)
        } catch (error) {
            alert(error.data.message.replace("execution reverted: ", ""))
        }
    }

    const isRegisteredCheck = (lSaleContract) => {
        if(lSaleContract===undefined)
            return
        
        lSaleContract.isWhitelisted().then(res=>{
            setIsRegistered(res);
        });
    }

    const participateSale = async () => {
        try {
           
            let bigAmount = BigNumber.from(Math.round(amount * 100)).mul(BigNumber.from(10).pow(props.ido.token.decimals - 2));
            debugger;
            saleContract.participate(bigAmount).then((res)=>{
                const transactipon = res.wait().then((tran)=>{

                });

                toast.promise(
                    transactipon,
                    {
                        pending: 'Transaction pending',
                        success: 'Token purchase successful',
                        error: 'Transaction failed'
                    }
                )
            }).catch((error)=>{
                
                toast.error(<>
                    <b>{"Request failed: "}</b> 
                    <br /> 
                    <code>{error.error.message}</code>
                </> )
            })
        } catch (error) {
            alert(error.data.message.replace("execution reverted: ", ""))
        }
    }

    const approve = async () => {
        try {
            tokenContract.approve(props.ido.contract_address, ethers.constants.MaxUint256).then((response) =>{
                debugger;
                let transaction = response.wait().then(tran=>{
                    setAllowance(ethers.constants.MaxUint256)
                })

                toast.promise(
                    transaction,
                    {
                        pending: 'Approval request pending',
                        success: 'New amount approved',
                        error: 'Transaction failed'
                    }
                )
            } );
        } catch (error) {
            alert(error.data.message.replace("execution reverted: ", ""))
        }
    }

    if (props.ido === undefined)
        return (<></>)

    return (

        <div className={classes.mainInfo}>
            <div className={classes.textBlock}>
                <div className={classes.title}> {props.title} </div>
                <div className={classes.text}> {props.text} </div>
                <div className={classes.media}>
                    {props.media.map((media, id) => {
                        return <a key={id} href={media.link}> <img alt="" src={media.img} /> </a>
                    })}
                </div>
                {showVerify ?
                <div className={classes.actionBlock}>
                    <div style={{color:"white", marginRight: '1em'}} className={classes.text}>
                        <div> You need to verify your KYC before participate sale </div>
                    </div> 
                    <div className={classes.mediaMobile}>
                        {props.media.map((media, id) => {
                            return <a key={id} href={media.link}> <img alt="" src={media.imgMobile} /> </a>
                        })}
                    </div>
                </div>
                :
                <div className={classes.actionBlock}>
                    <div className={classes.buttonBlock}>

                        {props.ido.timeline.sale_end > Date.now() / 1000
                        && props.ido.timeline.registration_start < Date.now() / 1000 
                        && (!isRegistered || props.ido.timeline.sale_start > Date.now() /1000)
                        && <button disabled={isRegistered} onClick={() => {
                           
                            if (!isRegistered)
                                registerForSale()
                        }}>
                            {isRegistered ? 'Registration completed' : 'Register'}
                        </button>}
                        {props.ido.timeline.sale_start < Date.now() / 1000 && props.ido.timeline.sale_end > Date.now() / 1000 && isRegistered  && 
                            <div className={classes.inputs}>

                                {props.ido.timeline.sale_start < Date.now() / 1000 && props.ido.timeline.sale_end > Date.now() / 1000  && 
                                    <div className={classes.inputFieldWrapper}>
                                        {false && <div className={classes.max} onClick={()=>setAmount(maxAmount)}>MAX</div>}
                                        <input type="number" value={amount} min ={0} className={classes.inputField} onChange={(e) => {
                                            setAmount(parseFloat(e.target.value));
                                        }} />
                                    </div>
                                }

                                {allowance >= amount && 
                                    <>
                                        <button onClick={() => { participateSale() }}>
                                            Buy Tokens
                                        </button>
                                    </>
                                }

                                {(allowance < amount || isNaN(amount)) && <button onClick={() => { approve() }}>
                                    Approve
                                </button>}
                            </div>}
                    </div>

                    <div className={classes.mediaMobile}>
                        {props.media.map((media, id) => {
                            return <a key={id} href={media.link}> <img alt="" src={media.imgMobile} /> </a>
                        })}
                    </div>
                </div>}
            </div>
        </div>
    )
}
