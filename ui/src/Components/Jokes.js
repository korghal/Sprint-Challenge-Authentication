import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class Jokes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jokeList: undefined
        }
    }

    render() {
        if (!localStorage.getItem('jwt')) {
            return (
                <Redirect to='/signin'></Redirect>
            )
        }
        if (this.state.jokeList !== undefined) {
            return (
                <div>
                    <h2>Users</h2>
                    <ul>
                    {this.state.jokeList.map(joke => {
                        return <li key={joke.id}>{joke.joke}</li>
                    })}
                    </ul>
                </div>
            )
        }
        else {
            return (
                <div>Nothing to see here.</div>
            )
        }
    }

    componentDidMount() {
        const token = localStorage.getItem('jwt');
        const options = {
            headers: {
                Authorization: token,
            }
        }
        if (token !== null) {
            axios.get('http://localhost:3300/api/jokes', options)
            .then((res) => {
                console.log(res);
                this.setState({
                    jokeList: res.data,
                });
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
}

export default Jokes;