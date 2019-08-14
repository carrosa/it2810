import {observer} from 'mobx-react';
import {decorate} from 'mobx';
import React, {Component} from 'react';
import BaseForm from './BaseForm';
import UserStore from '../../services/UserStore';
import '../Forms.scss';
import '../../styles/_buttons.scss';
import {Dialog, DialogContent, DialogActions, DialogTitle, Button, Input, InputLabel} from '@material-ui/core';
import MemeStore from '../../services/MemeStore';

class SignupForm extends Component {
  render() {
    return (

        <Dialog
            onBackdropClick={() => UserStore.toggleModal('')}
            onEscapeKeyDown={() => UserStore.toggleModal('')}
            open>
          <DialogContent>
            <form className="form">
              <DialogTitle>{UserStore.modal}</DialogTitle>

              <DialogContent>
                <InputLabel htmlFor={BaseForm.$('username').id}>
                  {BaseForm.$('username').label}:&nbsp;
                </InputLabel>
                <Input data-cy="signup_username" {...BaseForm.$('username').bind()}/>
                <p>{BaseForm.$('username').error}</p>
              </DialogContent>
              <DialogContent>
                <InputLabel htmlFor={BaseForm.$('password').id}>
                  {BaseForm.$('password').label}:&nbsp;
                </InputLabel>
                <Input data-cy="signup_password" {...BaseForm.$('password').bind({type: 'password'})} />
                <p>{BaseForm.$('password').error}</p>
              </DialogContent>
              <DialogActions>
                <Button fullWidth={true} variant="contained" data-cy="signup_submit" color="primary" component="button"
                        type="submit" onClick={BaseForm.onSubmit}>{UserStore.modal}</Button>
                <Button fullWidth={true} variant="contained" type="button" component="button"
                        onClick={BaseForm.onClear}>Clear</Button>
                <Button fullWidth={true} variant="contained" type="button" component="button" color="secondary"
                        onClick={() => UserStore.toggleModal('')}>Lukk</Button>
              </DialogActions>
              <p>{BaseForm.error}</p>
            </form>
          </DialogContent>
        </Dialog>
    );
  }
}

decorate(SignupForm, {
  render: observer
});

export default SignupForm;