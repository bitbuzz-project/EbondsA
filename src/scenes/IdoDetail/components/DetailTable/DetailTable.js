import React, { useEffect, useState } from "react";
import classes from "./DetailTable.module.scss"
import { ControlButton } from "./components/ControlButton/ControlButton";
import { TableRow } from "./components/TableRow/TableRow";
import { AllocationsInfo } from '../AllocationsInfo/AllocationsInfo'

const DetailTable = ({ ido }) => {
    const [activeButton, setActivateButton] = useState('sale_info');
    const [rowInfo, setRowInfo] = useState([
        {
            text: "Project Website",
            link: {
                url: "",
                text: "www.crabada.com"
            }
        },
        {
            text: "Number of Registrations",
            info: "15,290"
        },
        {
            text: "Vesting",
            info: "100% TGE"
        },
        {
            text: "TGE",
            info: "Nov 13th 2021 at 14:00"
        },
        {
            text: "Sale Contract Address",
            link: {
                url: "",
                text: "0x51208420EAba25b787008EE856665B2F4c5ed818",
                isShortText: true
            }
        }
    ]);
    const [tokenInfo, setTokenInfo] = useState([
        {
            text: "Token Name",
            info: "Crabada"
        },
        {
            text: "Token Symbol",
            info: "CRA"
        },
        {
            text: "Token Decimals",
            info: "18"
        },
        {
            text: "Total Supply",
            info: "1,000,000,000"
        },
        {
            text: "Token Address",
            link: {
                url: "",
                text: "0x51208420EAba25b787008EE856665B2F4c5ed818",
                isShortText: true
            }
        }
    ]);

    useEffect(() => {
        if (ido === undefined)
            return;

        let tempRowInfo = [...rowInfo];
        tempRowInfo[0].link.url = ido.website_url;
        tempRowInfo[0].link.text = ido.website_url;

        tempRowInfo[1].info = ido.project_detail.number_of_registration;

        tempRowInfo[2].info = ido.project_detail.vesting_text;

        tempRowInfo[3].info = new Date(ido.project_detail.tge).toLocaleString('en-US', {dateStyle: 'long'});

        tempRowInfo[4].link.text = ido.contract_address;

        setRowInfo([...tempRowInfo])


        let t_tokenInfo = [...tokenInfo];

        t_tokenInfo[0].info = ido.token.name;
        t_tokenInfo[1].info = ido.token.symbol;
        t_tokenInfo[2].info = ido.token.decimals;
        t_tokenInfo[3].info = ido.token.total_supply;
        t_tokenInfo[4].link.text = ido.token.token_address;

        setTokenInfo([...tokenInfo]);
    }, [ido]);

    function showTableRows() {

        let arrayToShow = []
        switch (activeButton) {
            case "sale_info":
                arrayToShow = rowInfo
                break;

            case "token_info":
                arrayToShow = tokenInfo
                break;

            default:
                break;
        }

        return arrayToShow.map((info, id) => {
            if (id + 1 == rowInfo.length) {
                info["showLine"] = false
            } else {
                info["showLine"] = true
            }
            return <TableRow key={id} {...info} />
        })
    };

    return (
        <div className={classes.detailTable} >
            <div className={classes.controlButtons}>
                <ControlButton
                    onClick={(ev) => { setActivateButton('sale_info') }}
                    isActive={activeButton === "sale_info"}
                    text="Sale Info"
                />
                <ControlButton
                    onClick={(ev) => { setActivateButton('token_info') }}
                    isActive={activeButton === "token_info"}
                    text="Token Info"
                />
                <ControlButton
                    onClick={(ev) => { setActivateButton('about_the_project') }}
                    isActive={activeButton === "about_the_project"}
                    text="About the Project"
                />
                <ControlButton
                    onClick={(ev) => { setActivateButton('your_allocations') }}
                    isActive={activeButton === "your_allocations"}
                    text="Your Allocations"
                />
            </div>

            {
                activeButton === "your_allocations" ?
                    <AllocationsInfo ido={ido}/>
                    : activeButton==='about_the_project' ? 
                        <div className={classes.aboutTheProject} dangerouslySetInnerHTML={{__html:ido.description}} />               
                    :
                    <div className={classes.tableBody}>
                        {showTableRows()}

                    </div>
            }

            
        </div>
    );
}

export default DetailTable;
