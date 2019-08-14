import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faCaretDown} from '@fortawesome/free-solid-svg-icons';
import * as styles from './Nav.scss';
import UserStore from '../../services/UserStore';
import SearchForm from '../../forms/Search/SearchForm';
import {observer} from 'mobx-react';
import {decorate} from 'mobx';
import MemeStore from '../../services/MemeStore';
import SignupForm from '../../forms/Auth/SignupForm';
import MemeModal from '../MemeModal/MemeModal';
import {AppBar, Button, Grid, Toolbar, IconButton, Divider} from '@material-ui/core';
import {HomeRounded} from '@material-ui/icons';


class Nav extends Component {

  showLoginModal() {
    UserStore.toggleModal('Login');
  }

  showSignupModal() {
    UserStore.toggleModal('Signup');
  }

  logout() {
    UserStore.logout();
  }

  render() {
    return (
        <AppBar color="primary" position="fixed">
          <Toolbar>
            <IconButton onClick={() => MemeStore.getMemes({}, true)}>
              <HomeRounded/>
            </IconButton>
            <Button variant="contained" color="secondary" type="button" onClick={() => MemeStore.setSearch()}>
              Search
            </Button>
            <Grid container
                  direction="row"
                  justify="flex-end">
              {UserStore.user.username.length > 0 ? (
                  <div className="username">
                    <label className="username--label">{UserStore.user.username}</label>
                    <Divider/>
                    <Button variant="contained" color="secondary" type="button" onClick={() => this.logout()}>
                      Logout
                    </Button>
                  </div>
              ) : (
                  <div>
                    <Button variant="contained" color="secondary" type="button"
                            onClick={() => this.showLoginModal()}>Login</Button>
                    <Button variant="contained" color="secondary" type="button"
                            onClick={() => this.showSignupModal()}>Signup</Button>
                  </div>
              )}
            </Grid>
          </Toolbar>
        </AppBar>
    );
  }
}

decorate(Nav, {
  render: observer
});

export default Nav;

/*
 * TODO: Delete this, its old
 *
 *
 * <div className='navbar'>
 <div className='navbar--home'>
 <FontAwesomeIcon icon={faHome} size='3x'/>
 </div>
 <div>
 <button onClick={() => MemeStore.setSearch()}>Search</button>
 </div>
 {UserStore.modal.length > 0 && (<div><SignupForm/></div>)}
 {MemeStore.showMeme.modal && (<div><MemeModal/></div>)}
 {MemeStore.search && (<SearchForm/>)}
 <div className='navbar--search'>

 </div>
 <div className='navbar--dropdown'>
 <div>
 <button className="navbar--dropdown--btn">Dropdown
 <FontAwesomeIcon icon={faCaretDown} size='3x'/>
 </button>
 <div className="navbar--dropdown--content">
 {UserStore.user ? (
 <div>
 <label>{UserStore.user.username}</label>
 <p onClick={() => this.logout()}>Logout</p>
 </div>
 ) : (
 <div>
 <p onClick={() => this.showLoginModal()}>Login</p>
 <p onClick={() => this.showSignupModal()}>Signup</p>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 *
 * */