import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {UserContext} from "./UserContext"
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export function Login() {
    const { setUser } = useContext(UserContext);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const checkUser = async (username, password) => {
        const res = await axios.get('/users');
        const { data } = res;
        var arr = Object.values(data);
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].username === username && arr[i].password === password) {
                return arr[i].email;
            }
        }
        return null;
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setWrongPassword(false);
        const email = await checkUser(username, password);
        if (email === null) {
            setWrongPassword(true);
            return;
        }
        setWrongPassword(false);
        const user = {email, username, password};
        const response = await axios.post('/users/login', user);
        const storeUser = response.data;
        setUser(storeUser);
        window.localStorage.setItem('id', storeUser);
        setLoggedIn(true);
    }


    return (
        <div>
        
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <h2 className="LoginTitle">
                Sign In
            </h2>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                />
                {wrongPassword ? <h6 className="error"> Invalid username or password. Try again. </h6> : null}
                <Button type="submit" fullWidth variant="outlined" sx= {{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
                <h6>New User? <a href="/register">Create your account</a> </h6>
                {loggedIn ? <Redirect to="/" /> : null}
            </Box>
            </Box>
        </Container>
        </div>
    )
}
