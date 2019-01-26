import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';

import './App.css';
import Login from './Components/Login';
import Register from './Components/Register';
import Jokes from './Components/Jokes';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            <NavLink className='main-menu-link' to='/login'>Login</NavLink>
            <NavLink className='main-menu-link' to='/register'>Register</NavLink>
            <NavLink className='main-menu-link' to='/jokes'>Jokes</NavLink>
          </nav>
          <Route exact path='/login' component={Login}></Route>
          <Route exact path='/register' component={Register}></Route>
          <Route exact path='/jokes' component={Jokes}></Route>
        </header>
      </div>
    );
  }
}

export default App;
