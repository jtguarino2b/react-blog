import { useRef, useState,useEffect }  from 'react';
import { Link as RouterLink, useNavigate,redirect} from 'react-router-dom'

// Materials UI
import { Grid, Paper, TextField, Button, Alert } from '@mui/material'

// Styles
import '../styles/register.scss';

const LOCAL_STORAGE_KEY = 'isLogin';

const RegisterUser = () => {

    const API_URL = 'http://api.blogs';
    const [errorMessage, setErrorMessage] = useState({});
    const navigate = useNavigate();

    const inputName = useRef();
    const inputUsername = useRef();
    const inputPassword = useRef();
    const inputConfirmPassowrd = useRef();

    useEffect(() => {
        const getIsLogin = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
       
        if(getIsLogin) {
            navigate('/blog');
            return;
        }
    },[navigate]);

    //Login User
    const handleRegister = () => {
        // get input values
        const name = inputName.current.value;
        const username = inputUsername.current.value;
        const password = inputPassword.current.value;
        const confirmPassword = inputConfirmPassowrd.current.value;
                        
        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: name, 
                email: username, 
                password: password, 
                confirm_password: confirmPassword })
        };

        fetch(API_URL + '/api/register', requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                
                // // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    setErrorMessage(data.data);   
                    return;
                }

                setErrorMessage({success: data.message});

                inputName.current.value = "";
                inputUsername.current.value = "";
                inputPassword.current.value = "";
                inputConfirmPassowrd.current.value = "";

                redirect('/');
            })
            .catch(error => {
                setErrorMessage({error: error.toString()});   
                console.error('There was an error!', error);
            });

    }
    
    return(
        <Grid>
            <Paper elevation={10} className="registerForm">
                <Grid align='center'>
                    <h1>Create User</h1>
                </Grid>

                {errorMessage.success && <Alert severity="success" className="success"> {errorMessage.success} </Alert>}
                {errorMessage.error && <Alert severity="error" className="success"> {errorMessage.error} </Alert>}
               
                <TextField inputRef={inputName} label='Full Name' placeholder='Enter email' variant="standard" className="email" fullWidth required/>
                {errorMessage && <div className="error"> {errorMessage.name} </div>}
                
                <TextField inputRef={inputUsername} label='Email Address' placeholder='Enter email' variant="standard" className="email" fullWidth required/>
                {errorMessage && <div className="error"> {errorMessage.email} </div>}

                <TextField inputRef={inputPassword} label='Password' placeholder='Enter password' type='password' className="password"  variant="standard" fullWidth required/>
                {errorMessage && <div className="error"> {errorMessage.password} </div>}

                <TextField inputRef={inputConfirmPassowrd} label='Confirm Pasword' placeholder='Confirm password' type='password' className="password"  variant="standard" fullWidth required/>
                {errorMessage && <div className="error"> {errorMessage.confirm_password} </div>}
                
                <Button type='submit' color='primary' variant="contained" fullWidth className="button" onClick={handleRegister}>Register</Button>
                <RouterLink to="/" className="center">
                    Back to Login
                </RouterLink>
            </Paper>
        </Grid>
    )
}

export default RegisterUser