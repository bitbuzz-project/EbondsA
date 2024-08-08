import { Controller, useForm } from "react-hook-form";
import React, { useState, useRef } from 'react';
import { Button } from '@mui/material';

import classes from './SalesForm.module.scss'
import { useEffect } from 'react';
import TextInput from "./components/TextInput/TextInput";
import { createIDO, createIDODetail, createTokenDetail, updateIDO, updateIDODetail, updateTokenDetail } from "../../API/idos.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSelectedIDO, setToUpdate } from "../../../../features/adminPageSlice";
import JoditEditor from "jodit-react";
import { getSingleIdo } from "../../../MainScreen/components/Table/API/idos";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createMediaDetail, deleteMediaDetail, updateMediaDetail } from "../../API/media";
import { createTimelinetail, updateTimelinetail } from "../../API/timeline";
import { salesFactoryAbi, salesFactoryAddress } from "../../../../consts/newSale";
import { ethers } from "ethers";
import LinearProgress from '@mui/material/LinearProgress';
import { toast } from 'react-toastify';


const SalesForm = () => {

    let selectedIDO = useSelector(state => state.adminPage.selectedIDO)
    const dispatch = useDispatch();
    const [saleContractAddress, setSaleContractAddress] = useState('');

    const { register, handleSubmit, reset, control, setValue } = useForm({
        defaultValues: {
            img_url: '',
            social_media: { url: '', type: 'fb' },
            contract_address: saleContractAddress
        }
    });

    const [content, setContent] = useState('')
    const [vesting_percent, setVestingPercent] = useState([])
    const [vesting_time, setVestingTime] = useState([])
    const [media, setMedia] = useState([])
    const [showVesting, setShowVesting] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    const getSaleContract = () => {
        const { ethereum } = window;

        //creating contract address for sale
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner();
            let contract = new ethers.Contract(salesFactoryAddress, salesFactoryAbi, signer);
            setIsLoading(true);
            contract.deploySale().then((res) => {
                let transaction = res.wait().then(result => {
                    contract.getLastDeployedSale().then(response => {

                        let resobj = { contract_address: response }
                        dispatch(setSelectedIDO(resobj));//update for abi constructo

                        setIsLoading(false);
                        setSaleContractAddress(response);//update local state
                        setValue('contract_address', response);//update form data
                    })
                })
                toast.promise(
                    transaction,
                    {
                        pending: 'Contract deployment transaction pending',
                        success: 'Contract deployment transaction successful',
                        error: 'Contract deployment transaction failed',
                    }
                )

            });
        }
    }

    useEffect(() => {
    }, [selectedIDO.contract_address])


    const config = {
        readonly: false // all options from https://xdsoft.net/jodit/doc/
    }
    // useEffect(()=>{
    //     dispatch(setSelectedIDO(null));
    // }, []);

    useEffect(async () => {
        if (!selectedIDO)
            return;

        if (selectedIDO.id === undefined)
            return;

        if (!isNaN(selectedIDO.endAt)) {
            const endAt = new Date(selectedIDO.endAt * 1000);
            setValue('sale_end', endAt.toISOString().split('T')[0]);
        }

        let ido_data = await getSingleIdo(selectedIDO.id).then(response => {
            return response.data.ido
        })
        debugger;
        setValue('title', ido_data.title);
        setValue('img_url', ido_data.logo_url);
        setValue('heading_text', ido_data.heading_text);
        setValue('description', ido_data.description);
        setValue('short_descriptions', ido_data.short_descriptions)
        setContent(ido_data.description)
        setValue('number_of_participants', ido_data.number_of_participants);

        // Project detail
        setValue("project_detail_id", ido_data.project_detail.id)
        setValue('website', ido_data.project_detail.website);
        setValue('vesting_text', ido_data.project_detail.vesting_text);

        if (ido_data.project_detail.tge !== '')
            setValue('tge', new Date(ido_data.project_detail.tge).toISOString().split('T')[0]);

        setValue('contract_address', ido_data.project_detail.contract_address);
        setVestingPercent(ido_data.project_detail.vesting_percent)
        setVestingTime(ido_data.project_detail.vesting_time)
        setValue("project_bg", ido_data.project_detail.project_bg)

        //Token detail
        setValue("token_id", ido_data.token.id)
        setValue("name", ido_data.token.name)
        setValue("decimals", ido_data.token.decimals)
        setValue("symbol", ido_data.token.symbol)
        setValue("token_address", ido_data.token.token_address)
        setValue("total_supply", ido_data.token.total_supply)
        setValue("all_time_high", ido_data.token.all_time_high)
        setValue("current_token_price", ido_data.token.current_token_price)
        setValue("token_distribution", ido_data.token.token_distribution)
        setValue("token_price_in_usd", ido_data.token.token_price_in_usd)
        setValue("total_raise", ido_data.token.total_raise)
        setValue("logo_url", ido_data.token.logo_url)
        setValue("total_tokens_sold", ido_data.token.total_tokens_sold)

        //Media detail
        setMedia(ido_data.socials)

        // Timeline
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        setValue("timeline_id", ido_data.timeline.id)
        setValue("registration_end", new Date(ido_data.timeline.registration_end * 1000 - tzoffset).toISOString().split('.')[0])
        setValue("registration_start", new Date(ido_data.timeline.registration_start * 1000 - tzoffset).toISOString().split('.')[0])
        setValue("sale_end", new Date(ido_data.timeline.sale_end * 1000 - tzoffset).toISOString().split('.')[0])
        setValue("sale_start", new Date(ido_data.timeline.sale_start * 1000 - tzoffset).toISOString().split('.')[0])
        setValue("sale_timeline_text", ido_data.timeline.sale_timeline_text);
        setValue("show_text", ido_data.timeline.show_text);


    }, [selectedIDO]);


    const onSubmit = (data) => {
        const toSend = { ...data };
        delete toSend.social_media;
        if (selectedIDO) {
            updateIDO({ ...toSend, img_url: 'https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-superJumbo.jpg?quality=75&auto=webp' }, selectedIDO.id).then(() => dispatch(setToUpdate(true)));
        } else {
            createIDO({ ...toSend, img_url: 'https://static01.nyt.com/images/2021/09/14/science/07CAT-STRIPES/07CAT-STRIPES-superJumbo.jpg?quality=75&auto=webp' }).then(() => dispatch(setToUpdate(true)));
        }
    };

    const editor = useRef(null)

    return (<>
        <form className={classes.formPanel}>
            {/* <div>
                <h1>
                    Sale information
                </h1>
            </div> */}

            <div>
                <h1>
                    Sale information
                </h1>
            </div>
            {/* 
            descriptions: str */}
            <div className={classes.formRow}>
                <TextInput
                    label="Project name"
                    name="title"
                    control={control}
                    type="text"
                />

                <TextInput
                    label="Number of participants"
                    name="number_of_participants"
                    control={control}
                    type="number"
                />

                <TextInput
                    label="Heading text"
                    name="heading_text"
                    control={control}
                    type="text"
                />

                <TextInput
                    label="Short description"
                    name="short_descriptions"
                    control={control}
                    type="text"
                />


            </div>

            <div style={{ display: 'block' }} >
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    control={control}
                    name="description"
                    tabIndex={1} // tabIndex of textarea
                    onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={newContent => { }}
                />
            </div>

            <hr />

            <div>
                <h1>
                    Project detail
                </h1>
            </div>
            <div className={classes.formRow}>
                <TextInput
                    label="Website"
                    name="website"
                    control={control}
                />

                <TextInput
                    label="Vesting text"
                    name="vesting_text"
                    control={control}
                />

                <TextInput
                    label="Contract address"
                    name="contract_address"
                    control={control}
                />

            </div>

            <div className={classes.formRow}>
                <TextInput
                    label="TGE"
                    name="tge"
                    control={control}
                    type="date"
                />
            </div>

            <div>
                <h1>
                    Vesting detail
                    <div
                        style={{ fontSize: '15px', textDecoration: "underline", color: "blueviolet" }}
                        onClick={(ev) => { ev.preventDefault(); setShowVesting(!showVesting) }}> show vesting </div>
                </h1>

                {showVesting ?
                    <div>
                        {vesting_time.map((data, id) => {
                            return (<div className={classes.formRow}>
                                <TextInput
                                    label="Date"
                                    name=""
                                    value_data={new Date(data * 1000).toISOString().split('T')[0]}
                                    control={control}
                                    type="date"
                                    onChangeGlobal={(ev => {
                                        let v = [...vesting_time]
                                        v[id] = new Date(ev.target.value).getTime() / 1000
                                        setVestingTime(v)
                                    })}
                                />


                                <TextInput
                                    label="Percent"
                                    name=""
                                    value_data={vesting_percent[id]}
                                    control={control}
                                    type="number"
                                    onChangeGlobal={(ev => {
                                        let v = [...vesting_percent]
                                        v[id] = ev.target.value
                                        setVestingPercent(v)
                                    })}
                                />

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}
                                    onClick={(ev) => {
                                        ev.preventDefault()
                                        let v = [...vesting_time]
                                        v.splice(id, 1)
                                        setVestingTime(v)
                                        v = [...vesting_percent]
                                        v.splice(id, 1)
                                        setVestingPercent(v)
                                    }}> Delete </div>

                            </div>)
                        })}
                        <Button onClick={(ev) => {
                            let v = [...vesting_time]
                            v.push(0)
                            setVestingTime(v)
                            v = [...vesting_percent]
                            v.push(0)
                            setVestingPercent(v)
                        }}> Add </Button>
                    </div>
                    : ""
                }
            </div>

            <hr />

            <h1>
                Token detail
            </h1>

            <div className={classes.formRow}>
                <TextInput
                    label="Token name"
                    name="name"
                    control={control}
                    type="text"
                />


                <TextInput
                    label="Symbol"
                    name="symbol"
                    control={control}
                    type="text"
                />


                <TextInput
                    label="Decimals"
                    name="decimals"
                    control={control}
                    type="number"
                />

            </div>
            <div className={classes.formRow}>
                <TextInput
                    label="Token address"
                    name="token_address"
                    control={control}
                    type="text"
                />


                <TextInput
                    label="Total supply"
                    name="total_supply"
                    control={control}
                    type="number"
                />
            </div>
            <div className={classes.formRow}>
                <TextInput
                    label="ATH"
                    name="all_time_high"
                    control={control}
                    type="number"
                />


                <TextInput
                    label="Current price"
                    name="current_token_price"
                    control={control}
                    type="number"
                />
                <TextInput
                    label="IDO price"
                    name="token_price_in_usd"
                    control={control}
                    type="number"
                />
            </div>
            <div className={classes.formRow}>
                <TextInput
                    label="Token distribution"
                    name="token_distribution"
                    control={control}
                    type="number"
                />


                <TextInput
                    label="Total raise"
                    name="total_raise"
                    control={control}
                    type="number"
                />
                <TextInput
                    label="Total tokens sold"
                    name="total_tokens_sold"
                    control={control}
                    type="number"
                />
            </div>

            <div className={classes.formRow}>
                <TextInput
                    label="Logo url"
                    name="logo_url"
                    control={control}
                    type="text"
                />

                <TextInput
                    label="Background image url"
                    name="project_bg"
                    control={control}
                    type="text"
                />
            </div>

            <hr />

            <h1>
                Social links
            </h1>

            <div className={classes.formRow}>
                {
                    <div>
                        {media.map((data, id) => {
                            return (<div className={classes.formRow}>
                                <TextInput
                                    label="Media url"
                                    name=""
                                    value_data={data.url}
                                    control={control}
                                    type="text"
                                    onChangeGlobal={(ev => {
                                        let m = [...media]
                                        m[id].url = ev.target.value
                                        setMedia(m)
                                    })}
                                />


                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                        <Select
                                            value={data.type}
                                            label="Type"
                                            onChange={(ev) => {
                                                let m = [...media]
                                                m[id].type = ev.target.value
                                                setMedia(m)
                                            }}
                                        >
                                            <MenuItem value={'twitter'}>Twitter</MenuItem>
                                            <MenuItem value={'medium'}>Medium</MenuItem>
                                            <MenuItem value={'telegram'}>Telegram</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}
                                    onClick={(ev) => {
                                        ev.preventDefault()
                                        deleteMediaDetail(media[id].id)
                                        let m = [...media]
                                        m.splice(id, 1)
                                        setMedia(m)
                                    }}> Delete </div>

                            </div>)
                        })}
                        <Button onClick={(ev) => {
                            let m = [...media]
                            m.push({
                                "type": "",
                                "url": ""
                            })
                            setMedia(m)
                        }}> Add </Button>
                    </div>
                }
            </div>

            <h1>
                Timeline
            </h1>
            <div className={classes.formRow}>
                <TextInput
                    label="Registration start"
                    name="registration_start"
                    control={control}
                    type="datetime-local"
                />

                <TextInput
                    label="Registration end"
                    name="registration_end"
                    control={control}
                    type="datetime-local"
                />

            </div>

            <div className={classes.formRow}>
                <TextInput
                    label="Sale start"
                    name="sale_start"
                    control={control}
                    type="datetime-local"
                />

                <TextInput
                    label="Sale start"
                    name="sale_end"
                    control={control}
                    type="datetime-local"
                />

            </div>

            <div className={classes.formRow}>
                <TextInput
                    label="Sale timeline text"
                    name="sale_timeline_text"
                    control={control}
                    type="text"
                />

                <input  {...register("show_text")} type="checkbox" id="scales" name="show_text" />
                <label for="show_text">Show text</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button onClick={handleSubmit(async (data) => {
                        setIsLoading(true);

                        debugger;

                        if (selectedIDO.id !== undefined) {
                            updateIDO({
                                participants: data.number_of_participants,
                                heading_text: data.heading_text,
                                title: data.title,
                                short_descriptions: data.short_descriptions,
                                descriptions: content,
                                explanation_text: data.explanation_text ? data.explanation_text : "",
                            }, selectedIDO.id)


                            let v = []
                            vesting_time.map(time => {
                                v.push(new Date(time * 1000).toISOString().split('T')[0])
                            })

                            let project_detail = {
                                "website": data.website,
                                "number_of_registration": data.participants,
                                "project_bg": data.project_bg,
                                "vesting_text": data.vesting_text,
                                "tge": data.tge,
                                "contract_address": data.contract_address,
                                "ido_id": selectedIDO.id,
                                "vesting_percent": vesting_percent,
                                "vesting_time": v
                            }


                            updateIDODetail(project_detail, data.project_detail_id)



                            let token_detail = {
                                name: data.name,
                                symbol: data.symbol,
                                decimals: data.decimals,
                                token_address: data.token_address,
                                total_supply: data.total_supply,
                                all_time_high: data.all_time_high,
                                current_token_price: data.current_token_price,
                                token_distribution: data.token_distribution,
                                token_price_in_usd: data.token_price_in_usd,
                                total_raise: data.total_raise,
                                logo_url: data.logo_url,
                                //total_tokens_sold: data.total_tokens_sold,// Add to validate
                                "ido_id": selectedIDO.id,

                            }

                            if (data.token_id) {
                                updateTokenDetail(token_detail, data.token_id)
                            } else {
                                createTokenDetail(token_detail)
                            }

                            media.map(m => {
                                if (m.id) {
                                    updateMediaDetail({ "type": m.type, "link": m.url, ido_id: selectedIDO.id }, m.id)
                                } else {
                                    createMediaDetail({ "type": m.type, "link": m.url, ido_id: selectedIDO.id })
                                }
                            })

                            let tml = {
                                registration_end: new Date(data.registration_end).toISOString(),
                                registration_start: new Date(data.registration_start).toISOString(),
                                sale_end: new Date(data.sale_end).toISOString(),
                                sale_start: new Date(data.sale_start).toISOString(),
                                sale_timeline_text: data.sale_timeline_text,
                                show_text: data.show_text,
                                ido_id: selectedIDO.id
                            }
                            if (data.timeline_id) {
                                updateTimelinetail(tml, data.timeline_id)
                            } else {
                                createTimelinetail(tml)
                            }
                            setIsLoading(false);
                            return;

                        }
                        else {
                            await createIDO({
                                participants: data.number_of_participants,
                                heading_text: data.heading_text,
                                title: data.title,
                                descriptions: content,
                                explanation_text: data.explanation_text ? data.explanation_text : "",
                                short_descriptions: data.short_descriptions,
                                // token_price: data.token_price_in_usd
                            }).then(response => {

                                selectedIDO = response.data
                            })
                        }
                        let v = []
                        vesting_time.map(time => {
                            v.push(new Date(time * 1000).toISOString().split('T')[0])
                        })
                        let project_detail = {
                            "website": data.website,
                            "number_of_registration": data.participants,
                            "project_bg": data.project_bg,
                            "vesting_text": data.vesting_text,
                            "tge": data.tge,
                            "contract_address": data.contract_address,
                            "ido_id": selectedIDO.id,
                            "vesting_percent": vesting_percent,
                            "vesting_time": v
                        }

                        if (data.project_detail_id) {
                            updateIDODetail(project_detail, data.project_detail_id)
                        } else {
                            createIDODetail(project_detail)
                        }

                        let token_detail = {
                            name: data.name,
                            symbol: data.symbol,
                            decimals: data.decimals,
                            token_address: data.token_address,
                            total_supply: data.total_supply,
                            all_time_high: data.all_time_high,
                            current_token_price: data.current_token_price,
                            token_distribution: data.token_distribution,
                            token_price_in_usd: data.token_price_in_usd,
                            total_raise: data.total_raise,
                            logo_url: data.logo_url,
                            //total_tokens_sold: data.total_tokens_sold, //Add to validate
                            "ido_id": selectedIDO.id,

                        }

                        if (data.token_id) {
                            updateTokenDetail(token_detail, data.token_id)
                        } else {
                            createTokenDetail(token_detail)
                        }

                        media.map(m => {
                            if (m.id) {
                                updateMediaDetail({ "type": m.type, "link": m.url, ido_id: selectedIDO.id }, m.id)
                            } else {
                                createMediaDetail({ "type": m.type, "link": m.url, ido_id: selectedIDO.id })
                            }
                        })

                        let tml = {
                            registration_end: new Date(data.registration_end).toISOString(),
                            registration_start: new Date(data.registration_start).toISOString(),
                            sale_end: new Date(data.sale_end).toISOString(),
                            sale_start: new Date(data.sale_start).toISOString(),
                            sale_timeline_text: data.sale_timeline_text,
                            show_text: data.show_text,
                            ido_id: selectedIDO.id
                        };


                        if (data.timeline_id) {
                            updateTimelinetail(tml, data.timeline_id)
                        } else {
                            createTimelinetail(tml)
                        }
                        setIsLoading(false);
                    })

                    } variant="contained" style={{ marginRight: '1em' }}>
                        {selectedIDO && selectedIDO.id !== undefined ? 'Update IDO' : 'Create IDO'}
                    </Button>

                    <Button
                        onClick={() => {
                            dispatch(setSelectedIDO(null));
                            reset({
                                name: '',
                                img_url: ' ',
                                symbol: '',
                                ido_price: '',
                                current_price: '',
                                ath: '',
                                participants: '',
                                total_raised: '',
                                tokens_sold: '',
                                sale_end: ''
                            });
                        }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                </div>

                <div>
                    {(!selectedIDO || selectedIDO.id === undefined)
                        && (selectedIDO.contract_address === '' || selectedIDO.contract_address === undefined) &&
                        <Button
                            onClick={() => getSaleContract()}
                            variant="outlined"
                        >
                            Generate sale contract address
                        </Button>
                    }

                </div>



            </div>
            {isLoading && <LinearProgress style={{ marginTop: '1em' }} />}

        </form>
    </>);
}

export default SalesForm;