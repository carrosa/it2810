import {observable, decorate, action} from 'mobx';
import APIService from './APIService';


class UserStore {
  constructor() {
    this.api = new APIService();
    this.modal = '';
    // Gets from localstorage when initialized
    this.user = {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')
    };
  }

  toggleModal(type) {
    this.modal = type;
  }

  // Logs out user (resets user object and localstorage)
  logout() {
    this.user = {
      username: '',
      token: ''
    };
    localStorage.setItem('username', '');
    localStorage.setItem('token', '');
  }

  // put this.user in local storage so you can refresh the app without becoming logged out
  updateLocalStorage() {
    localStorage.setItem('username', this.user.username);
    localStorage.setItem('token', this.user.token);
  }



  // Signs up/ Signs in depending on what type of modal is open
  async signAction(username, password) {
    // If modal is of type 'Signup' we will create a new user
    if (this.modal === 'Signup') {
      await this.api.signUp(username, password)
          .then(res => {
            if (res.error) {
              alert(`Failed to create user: ${res.error}`);
            } else {
              this.modal = '';
              alert(`Created user: ${res.user}`);
            }
          });
    }
    // If modal is of type 'Login' then we will sign you in
    else if (this.modal === 'Login') {
      await this.api.signIn(username, password)
          .then(res => {
            if (res.error) {
              alert(`Failed to log in: ${res.error}`);
            } else {
              this.modal = '';
              this.user = {
                token: res.token,
                username: res.user
              };
              this.updateLocalStorage();
              alert(`Logged in user: ${res.user}`);
              console.log(res.token);
            }
          });
    }
  }
}

decorate(UserStore, {
  toggleModal: action,
  signAction: action,
  logout: action,
  modal: observable,
  user: observable
});

export default new UserStore();