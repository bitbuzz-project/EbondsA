import { useState, useContext, createContext } from 'react'

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../Form/components/TextInput/TextInput';
import { Button } from '@mui/material';

import { useForm } from 'react-hook-form';

import classes from './AuthDialog.module.scss'
import { signUp, login } from './API/adminPanelAuth'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



const AuthDialog = ({ show, setDialog }) => {
    const { handleSubmit, reset, control, setValue, watch } = useForm();
    const [register, setRegister] = useState(false);
    const [passwordMissmatch, setPasswordMissmatch] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const watchConfirm = watch('confirm_password'); 
    const watchPassword = watch('password');
    const watchEmail = watch('email');
     
    useEffect(()=>{
        setPasswordMissmatch(false);
        setError(false);
    }, [watchConfirm, watchPassword, watchEmail]);

    return (<>
        <Dialog open={show} fullWidth maxWidth={"xs"}>
            <DialogTitle className={classes.dialogTitle}>
                <h2>
                    {register ? 'Create an account' : 'Login'}
                </h2>
                <IconButton onClick={() => {
                    setDialog(false)
                    if (sessionStorage.getItem("adminAuth") !== 'true') {
                        navigate('/');
                    }
                }}>
                    <CloseIcon />
                </IconButton>

            </DialogTitle>
            <DialogContent>
                <div className={classes.inputs}>
                    <TextInput
                        label="Login"
                        name='email'
                        control={control}
                        type="text"
                    />
                    <TextInput
                        label="Password"
                        name='password'
                        control={control}
                        type="password"
                    />

                    {register && <TextInput
                        label="Confirm password"
                        name='confirm_password'
                        control={control}
                        type="password"
                    />}

                    {error && !register && <p className={classes.errorMessage}>Email or password are incorrect</p>}
                    {error && register && passwordMissmatch && <p className={classes.errorMessage}>Passwords do not match</p>}
                    {error && register && !passwordMissmatch && <p className={classes.errorMessage}>Failed to create an admin account</p>}
                </div>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <div>
                    <Button onClick={() => {setError(false); setRegister(!register)}}> {register ? 'Back to login page' : 'Create an account'}</Button>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setDialog(false)
                            if (sessionStorage.getItem("adminAuth") !== 'true') {
                                navigate('/');
                            }
                        }}
                    >Cancel</Button>
                    <Button variant="contained" onClick={
                        handleSubmit(
                            (data) => {
                                setError(false);
                                setPasswordMissmatch(false);
                                if (register) {
                                    if(data.password===data.confirm_password){
                                        signUp({password: data.password, email: data.email})
                                        .then((response) => {
                                            if (response.data.status === 'success') {
                                                sessionStorage.setItem('adminAuth', 'true');
                                                setDialog(false);
                                            }
                                        })
                                        .catch((error)=>{
                                            setError(true);
                                        })
                                    }else{
                                        setPasswordMissmatch(true);
                                        setError(true);
                                    }
                                    
                                } else {
                                    login({password: data.password, email: data.email})
                                    .then((response) => {
                                        if (response.data.status === 'success') {
                                            sessionStorage.setItem('adminAuth', 'true');
                                            setDialog(false);
                                        }
                                    })
                                    .catch(()=>{
                                        setError(true);
                                    });
                                }

                            },
                            (data) => {
                                console.log("invalid fields", data)
                            }
                        )
                    }>{register ? 'Register' :'Login'} </Button>
                </div>
            </DialogActions>
        </Dialog>
    </>);
}

export default AuthDialog;