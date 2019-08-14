import {observer} from 'mobx-react';
import {decorate} from 'mobx';
import React, {Component} from 'react';
import BaseForm from './BaseForm';
import MemeStore from '../../services/MemeStore';
import '../../styles/_buttons.scss';
import {Dialog, DialogContent, DialogActions, Button, Input, InputLabel, DialogTitle} from '@material-ui/core';


class SearchForm extends Component {

  // Renders search dialog with searchform
  render() {
    return (
        <Dialog
            onBackdropClick={() => MemeStore.setSearch()}
            onEscapeKeyDown={() => MemeStore.setSearch()}
            open
        >
          <form className="form">
            <DialogTitle>Search</DialogTitle>
            <DialogContent>
              <InputLabel htmlFor={BaseForm.$('author').id}>
                {BaseForm.$('author').label}:&nbsp;
              </InputLabel>
              <Input {...BaseForm.$('author').bind()}/>
            </DialogContent>
            <DialogContent>
              <InputLabel htmlFor={BaseForm.$('title').id}>
                {BaseForm.$('title').label}:&nbsp;
              </InputLabel>
              <Input {...BaseForm.$('title').bind()}/>
            </DialogContent>
            <DialogContent>
              <InputLabel htmlFor={BaseForm.$('nsfw').id}>
                {BaseForm.$('nsfw').label}:&nbsp;
              </InputLabel>
              <select {...BaseForm.$('nsfw').bind()}>
                <option value="">---All---</option>
                <option value="true">Only NSFW</option>
                <option value="false">Only SFW</option>
              </select>
            </DialogContent>
            <DialogContent>

              <InputLabel htmlFor={BaseForm.$('ups').id}>
                {BaseForm.$('ups').label}:&nbsp;
              </InputLabel>
              <select {...BaseForm.$('ups').bind()}>
                <option value="">---------</option>
                <option value="1">Ascending</option>
                <option value="-1">Descending</option>
              </select>
            </DialogContent>

            <DialogActions>
              <Button variant="contained" color="primary" type="submit" onClick={BaseForm.onSubmit}>Search</Button>
              <Button variant="contained" type="button" onClick={BaseForm.onClear}>Clear</Button>
              <Button variant="contained" color="secondary" type="button"
                      onClick={() => MemeStore.setSearch()}>Close</Button>
            </DialogActions>


            <p>{BaseForm.error}</p>
          </form>
        </Dialog>

    );
  }
}

decorate(SearchForm, {
  render: observer
});

export default SearchForm;