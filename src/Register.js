import React, { Component } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      registered: false,
      userCreated: false
    }
  }

  async checkExisted (email, username) {
    const res = await axios.get('http://localhost:3001/users');
    const { data } = res;
    var arr = Object.values(data);
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i].email, arr[i].username);
      if (email === arr[i].email || username === arr[i].username) {
        return true;
      }
    }
    return false;
  }

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value });
  }

  submitHandler = async (e) => {
    e.preventDefault();
    console.log(this.state);
    const existed = await this.checkExisted(this.state.email, this.state.username);
    console.log(existed);
    if (existed === false) {
      const response = await axios.post('http://localhost:3001/users/add', this.state);
      console.log(response);
      this.setState({userCreated: true});
      window.location.href = "/login";
    } else {
      this.setState({registered: true});
    }
  }

  render() {
    return (
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
              Sign Up
            </h2>
            <Box component="form" onSubmit={this.submitHandler} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                onChange={this.changeHandler}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                type="username"
                autoComplete="username"
                autoFocus
                onChange={this.changeHandler}
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
                onChange={this.changeHandler}
              />
              {this.state.registered ? <h6 className="error"> Username or password has already been taken. Please try again </h6> : null}
              {this.state.userCreated ? <h5 className="success"> User created successfully! Click <Link to="/login">here</Link> to login.</h5> : null}
              <Button type="submit" fullWidth variant="outlined" sx={{ mt: 3, mb: 2 }}>
                Register!
              </Button>
              <h6> Already have an account? <a href="/login"> Log In</a> </h6>
            </Box>
          </Box>
        </Container>
    );
  }
}

export default Register
