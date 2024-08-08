import React from "react";
import classes from "./Table.module.scss"
import { TableHeader } from "./components/TableHeader/TableHeader";
import { TableRow } from "./components/TableRow/TableRow";
import Img from './test_img.svg'
import { Button } from "./components/ControlButton/ControlButton";
import FilteButton from '../../../../resources/filter_button.svg'

import { useDispatch, useSelector } from 'react-redux';

import { getIdos } from './API/idos';
import { useEffect, useState } from "react";

import { setToUpdate } from '../../../../features/adminPageSlice';

const UpcomingTable = ({ upcoming, ongoing }) => {
    const [idos, setIDOs] = useState([]);
    const [activeType, setActiveType] = useState(-1);
    const [sorting, setSorting] = useState(1);
    const [rotateRate, setRotateRate] = useState(0);

    const dispatch = useDispatch();

    const toUpdate = useSelector(state => state.adminPage.toUpdate);

    const parseIdo = (img, symbol, name, idoPrice, currentPrice, ath, roi, partisipants, totalRaised, totalTokenSold, endAt, id, contract_address) => {
        return { img, symbol, name, idoPrice, currentPrice, ath, roi, partisipants, totalRaised, totalTokenSold, endAt, id, contract_address }
    }

    useEffect(() => {
        if (upcoming !== undefined) {
            getIdos().then((response) => {
                setIDOs(response.data.upcoming.map(e => {
                    return parseIdo(e.logo_url, e.token.symbol, e.token.name, parseFloat(e.token.token_price_in_usd), parseFloat(e.token.current_token_price), parseFloat(e.token.all_time_high), parseFloat(e.token.current_token_price) / parseFloat(e.token.all_time_high), e.number_of_participants, e.token.total_raise, e.token.total_tokens_sold, e.timeline.sale_end, e.id, e.contract_address)
                }));
            })

        }
        else if(!!ongoing){
            getIdos().then((response) => {
                setIDOs(response.data.ongoing.map(e => {
                    return parseIdo(e.logo_url, e.token.symbol, e.token.name, parseFloat(e.token.token_price_in_usd), parseFloat(e.token.current_token_price), parseFloat(e.token.all_time_high), parseFloat(e.token.current_token_price) / parseFloat(e.token.all_time_high), e.number_of_participants, e.token.total_raise, e.token.total_tokens_sold, e.timeline.sale_end, e.id, e.contract_address)
                }));
            });
        }
        else {
            getIdos().then((response) => {
                setIDOs(response.data.ended.map(e => {
                    return parseIdo(e.logo_url, e.token.symbol, e.token.name, parseFloat(e.token.token_price_in_usd), parseFloat(e.token.current_token_price), parseFloat(e.token.all_time_high), parseFloat(e.token.current_token_price) / parseFloat(e.token.all_time_high), e.number_of_participants, e.token.total_raise, e.token.total_tokens_sold, e.timeline.sale_end, e.id, e.contract_address)
                }));
            })

        }
    }, []);

    useEffect(() => {
        if (!toUpdate)
            return;

        if (upcoming !== undefined) {
            getIdos().then((response) => {
                setIDOs(response.data.upcoming.map(e => {
                    return parseIdo(e.logo_url, e.token.symbol, e.token.name, parseFloat(e.token.token_price_in_usd), parseFloat(e.token.current_token_price), parseFloat(e.token.all_time_high), parseFloat(e.token.current_token_price) / parseFloat(e.token.all_time_high), e.number_of_participants, e.token.total_raise, e.token.total_tokens_sold, e.timeline.sale_end, e.id)
                }));
            })
            dispatch(setToUpdate(false));
        }
        else {
            getIdos().then((response) => {
                setIDOs(response.data.ended.map(e => {
                    return parseIdo(e.logo_url, e.token.symbol, e.token.name, parseFloat(e.token.token_price_in_usd), parseFloat(e.token.current_token_price), parseFloat(e.token.all_time_high), parseFloat(e.token.current_token_price) / parseFloat(e.token.all_time_high), e.number_of_participants, e.token.total_raise, e.token.total_tokens_sold, e.timeline.sale_end, e.id)
                }));
            })
            dispatch(setToUpdate(false));
        }



    }, [toUpdate]);

    useEffect(() => {
        switch (activeType) {
            case 0:
                setIDOs([...idos].sort((a, b) => sorting * (a.endAt - b.endAt)))
                break;

            case 1:
                setIDOs([...idos].sort((a, b) => sorting * (a.roi - b.roi)))
                break;

            case 2:
                setIDOs([...idos].sort((a, b) => sorting * (a.totalRaised - b.totalRaised)))
                break;
        }
    }, [sorting]);

    return (<>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div className={classes.controlButton}>
                <Button
                    isActive={activeType === 0 ? true : false}
                    text="Sale Ended At"
                    onClick={
                        (ev) => {
                            setActiveType(0);
                            setIDOs(idos.sort((a, b) => sorting * (a.endAt - b.endAt)));
                        }
                    }
                />

                <Button
                    isActive={activeType === 1 ? true : false}
                    text="ATH IDO ROI"
                    onClick={
                        (ev) => {
                            setActiveType(1);
                            setIDOs(idos.sort((a, b) => sorting * (a.roi - b.roi)));
                        }}
                />

                <Button
                    isActive={activeType === 2 ? true : false}
                    text="Total Raised"
                    onClick={
                        (ev) => {
                            setActiveType(2);
                            setIDOs(idos.sort((a, b) => sorting * (a.totalRaised - b.totalRaised)));
                        }
                    }
                />
            </div>
            <img
                style={{ transform: `rotate(${rotateRate}deg)` }}
                onClick={(ev) => {
                    setRotateRate(rotateRate === 0 ? 180 : 0)
                    setSorting(-1 * sorting);
                }}
                alt=""
                src={FilteButton}
            />
        </div>
        <div className={classes.Table}>
            <TableHeader />
            <div className={classes.line} />
            {
                idos.map((ido, index) => {
                    ido.color = index % 2 ? "linear-gradient(rgb(10, 167, 245, 0.1) 0%, rgb(60, 231, 255, 0.1) 100%)" : "#FFFFFF"
                    return TableRow(ido)
                })
            }
        </div>
    </>);
}

export default UpcomingTable;
