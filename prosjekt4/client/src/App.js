import React, {Component} from 'react';
import Frontpage from './components/Frontpage/Frontpage';
import Nav from './components/Nav/Nav';
import {AppBar, Button} from '@material-ui/core';
import MemeStore from './services/MemeStore';



class App extends Component {
  render() {
    return (
        <div className="App">
          <Nav/>
          <Frontpage/>
        </div>
    );
  }
}

export default App;
