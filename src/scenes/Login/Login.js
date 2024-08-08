import classes from './Login.module.scss'
import Cookies from 'universal-cookie';
import { useForm } from 'react-hook-form';
import TextInput from './components/TextInput/TextInput'
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const cookies = new Cookies();
    const auth = !!cookies.get('auth');
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const { handleSubmit, reset, control, setValue, watch } = useForm({
        defaultValues: {

        }
    });

    const watchPassword = watch('password');
    const watchEmail = watch('login');

    useEffect(()=>{
        setError(false);

    }, [watchEmail, watchPassword])


    return (<div className={classes.loginPage}>
        <div className={classes.loginCard}>
            <header>
                <h2>
                    Login
                </h2>
            </header>
            <section>
                <div className={classes.input}>
                    <TextInput
                        label="Login"
                        name='login'
                        control={control}
                        type="text"
                    />
                </div>

                <div className={classes.input}>
                    <TextInput
                        label="Password"
                        name='password'
                        control={control}
                        type="password"
                    />
                </div>

                <footer>
                    <p style={{visibility: !error ? 'hidden': ''}}>Email or password are incorrect</p>
                    <Button 
                        variant='outlined'
                        onClick={handleSubmit(data=>{
                            if(data.login === 'user_access' && data.password==='87654321'){
                                cookies.set('auth', 'TOKEN');
                                navigate('/');
                            }else{
                                setError(true);
                            }
                        })}
                    >
                        Log in
                    </Button>
                </footer>
            </section>
        </div>
    </div>);
}

export default Login;