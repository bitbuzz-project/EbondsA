import React from "react";
import classes from "./Table.module.scss"
import { TableHeader } from "./components/TableHeader/TableHeader";
import { TableRow } from "./components/TableRow/TableRow";
import Img from './test_img.svg'
import { Button } from "./components/ControlButton/ControlButton";
import FilteButton from '../../../../resources/filter_button.svg'

import { getIdos } from './API/idos';
import { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux';
import {setToUpdate } from "../../../../features/adminPageSlice";
import { getUpcomingIdos } from "../../../MainScreen/components/IDOBlock/API/upcomingIDOs";

const UpcomingTable = () => {
    const [idos, setIDOs] = useState([]);
    const [activeType, setActiveType] = useState(-1);
    const [sorting, setSorting] = useState(1);
    const [rotateRate, setRotateRate] = useState(0);

    const toUpdate = useSelector(state=>state.adminPage.toUpdate);
    const dispatch = useDispatch();

    const parseIdo = (img, symbol, name, idoPrice, currentPrice, ath, roi, partisipants, totalRaised, totalTokenSold, endAt, id) => {
        return { img, symbol, name, idoPrice, currentPrice, ath, roi, partisipants, totalRaised, totalTokenSold, endAt, id }
    }

    useEffect(() => {
        getUpcomingIdos().then((response) => {
            setIDOs(response.data.idos.map(e => {
                return parseIdo(e.img_url, e.symbol, e.name, e.ido_price, e.current_price, e.ath, e.ido_price / e.ath, e.participants, e.total_raised, e.tokens_sold, Date.parse(e.sale_end) / 1000, e.id)
            }));
        })
    }, []);

    useEffect(() => {
        if(!toUpdate)
            return;

        getIdos().then((response) => {
            setIDOs(response.data.upcoming.map(e => {
                return parseIdo(e.logo_url, e.token.symbol, e.name, e.ido_price, e.current_price, e.ath, e.ido_price / e.ath, e.participants, e.total_raised, e.tokens_sold, Date.parse(e.sale_end) / 1000, e.id)
            }));
        })
        dispatch(setToUpdate(false));

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
