import React, { useState } from 'react'
import TextInput from '../../../AdminPanel/components/Form/components/TextInput/TextInput';
import classes from './FunctionConstructor.module.scss'
import { Controller, useForm } from "react-hook-form";
import { Button } from '@mui/material';
import { array } from 'prop-types';

const FunctionConstructor = (props) => {

    const [outputs, setOutputs] = useState([])

    const { handleSubmit, reset, control, setValue } = useForm({
        defaultValues: {
            
        }
    });
    
    return (
        <div>
                {  
                    props.data["inputs"] && props.data["inputs"].map((input, index) => {
                        if( props.data.type === "function")
                            return <div className={classes.formRow}>
                                        <h1>
                                        {input.name} :
                                        </h1>
                                        <TextInput
                                            label={input.type}
                                            name={input.name == "" ? index.toString() : input.name}
                                            control={control}
                                            type="text"
                                            />
                                    </div>
                        } )
                }                
            <Button className={classes.button} onClick={handleSubmit(async (data) => {
                
                let requestJson = []
                try {
                    props.data["inputs"] && props.data["inputs"].map((input, index) => {
                        requestJson.push(data[input.name == "" ? index.toString() : input.name])
                    })
                    
                    await props.contract[props.data.name].call(props.contract, ...requestJson).then(response => {
                        if (Array.isArray(response)) {
                            setOutputs(response)
                        } else {
                            let arr = []
                            arr.push(response)
                            setOutputs(arr)
                        }
                    } )
                } catch (error) {
                    alert('Transaction failed: ', error)
                    console.log("error", error)                    
                }
                })} >
                    transact
                </Button>
            
            {
                outputs.map((output, index) => {
                    try {
                        return <div className={classes.textOutputs} > {props.data.outputs[index].name}: {output.toString()} </div>
                    } catch (error) {
                        
                    }
                } )    
            }

        </div>
    )
    

}

export default FunctionConstructor;