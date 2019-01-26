import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    render() {
        return (
            <form onSubmit={this.formSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input name="username" onChange={this.handleInput} type='text'/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input name="password" onChange={this.handleInput} type='text'/>
                </div>
                <div>
                    <button type='submit'>Register</button>
                </div>
            </form>
        )
    }

    handleInput = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    formSubmit = (event) => {
        event.preventDefault();
        const credentials = {username: this.state.username, password: this.state.password}
        axios.post('http://localhost:3300/api/register/', credentials)
        .then((res) => {
            localStorage.setItem('jwt', res.data.token);
        })
        .catch((error) => {
            console.log(error);
        })
    }
}

export default Register;