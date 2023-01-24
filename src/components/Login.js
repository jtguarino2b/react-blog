import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Materials UI
import { Grid, Paper, TextField, Button, Typography, Alert } from '@mui/material';

// Styles
import '../styles/login.scss';

const LOCAL_STORAGE_KEY = 'isLogin';
const LOCAL_STORAGE_USERTOKEN = 'token';
const LOCAL_STORAGE_USER = 'user';

const Login = () => {

    const API_URL = 'http://api.blogs';
    const [errorMessage, setErrorMessage] = useState({});
    const navigate = useNavigate();

    const inputUsername = useRef();
    const inputPassword = useRef();
   
    useEffect(() => {
        const getIsLogin = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

        if(getIsLogin) {
            navigate('/blog');
            return;
        }
    },[navigate]);
   
    //Login User
    const handleLogin = () => {
        // get input values
        const username = inputUsername.current.value;
        const password = inputPassword.current.value;
                
        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: username, password: password })
        };

        fetch(API_URL + '/api/login', requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    // const error = (data && data.message) || response.status;
                    setErrorMessage(data); 
                    return;
                }
                setErrorMessage({});
                
                //Save data to local storage 
                localStorage.setItem(LOCAL_STORAGE_KEY, true);
                localStorage.setItem(LOCAL_STORAGE_USERTOKEN, JSON.stringify({
                    accessToken : data.data.token + "-" + data.data.name.split('|')[1]
                }));
                localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify({
                    name : data.data.name.split('|')[0]
                }));

                navigate('/blog');
            })
            .catch(error => {
                setErrorMessage({error: error.toString()});   
                console.error('There was an error!', error);
            });

    }
    
    return(     
        <Grid>
            <Paper elevation={10} className="loginForm">
                <Grid align='center'>
                    <h1>Sign In</h1>
                </Grid>
                
                {errorMessage && <div className="error"> {errorMessage.message} </div>}
                {errorMessage.error && <Alert severity="error" className="success"> {errorMessage.error} </Alert>}
                
                <TextField  inputRef={inputUsername} label='Username' placeholder='Enter username' variant="standard" className="username" fullWidth required/>
                <TextField inputRef={inputPassword} label='Password' placeholder='Enter password' type='password' className="password"  variant="standard" fullWidth required/>
                
                <Button type='submit' color='primary' variant="contained" fullWidth className="signinBtn" onClick={handleLogin}>Sign in</Button>
                
                <Typography > Do you have an account ?
                    <RouterLink to="/register" > 
                        Sign Up 
                    </RouterLink>
                </Typography>
            </Paper>
        </Grid>
        
    )
}

export default Login