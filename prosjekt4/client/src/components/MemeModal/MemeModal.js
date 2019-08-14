import React, {Component} from 'react';
import {decorate} from 'mobx';
import {observer} from "mobx-react";
import './MemeModal.scss';
import MemeStore from '../../services/MemeStore';
import UserStore from '../../services/UserStore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Input,
  InputLabel,
  Divider,
  Paper
} from '@material-ui/core';


class MemeModal extends Component {

  // Strips the datestring and reverses it to get a date that is ok to read for us humans
  dateStringToReadableDateConverter(dateString) {
    const date = dateString.split('T')[0].split('-').reverse();
    date[0] += '-';
    date[1] += '-';
    return date;
  }

  // returner en liste med bilder, satt som observer. mobx-react
  renderComments() {
    let commentContainer = [];
    if (MemeStore.memesLoaded) {
      MemeStore.showMeme.meme.comments.forEach((comment, i) => {
        commentContainer.push(
            <div key={i} className="spacer">
              <Paper>
                <div className="row">
                  <InputLabel>
                    Made by: {comment.author.username}
                  </InputLabel>
                  <InputLabel>
                    {this.dateStringToReadableDateConverter(comment.created)}
                  </InputLabel>
                </div>
                <Divider/>
                <div className="comment spacer">
                  {comment.comment}
                </div>
              </Paper>
            </div>
        );
      });
    }
    return commentContainer;
  }

  buttonPress(event) {
    if (event.keyCode === 27) {
      MemeStore.unsetShowMeme();
    }

    if (event.keyCode === 39) {
      MemeStore.showNextMeme();
    }

    if (event.keyCode === 37) {
      MemeStore.showPrevMeme();
    }


  }

  componentDidMount() {
    document.addEventListener("keydown", this.buttonPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.buttonPress, false);
  }

  render() {
    return (
        <Dialog
            onBackdropClick={() => MemeStore.unsetShowMeme()}
            onEscapeKeyDown={() => MemeStore.unsetShowMeme()}
            open>
          <DialogTitle>{MemeStore.showMeme.meme.title}</DialogTitle>
          <DialogContent>
            <img className="center-img" src={MemeStore.showMeme.meme.media}/>
            <Divider/>
            <InputLabel>Comments:</InputLabel>
            {this.renderComments()}
            {UserStore.user.username.length > 0 && (
                <div className="row">
                  <div>
                    <InputLabel>New comment: </InputLabel>
                    <Input onChange={e => MemeStore.updateComment(e)} value={MemeStore.comment}/>
                  </div>
                  <Button
                      disabled={MemeStore.comment.length < 1}
                      onClick={() => {
                        MemeStore.postComment(MemeStore.showMeme.meme._id, UserStore.user.token, MemeStore.comment);
                      }}
                      color="primary" type="button" variant="contained">Post
                    comment</Button>
                </div>
            )}
          </DialogContent>
        </Dialog>

    );
  }
}

decorate(MemeModal, {
  render: observer
});

/*
 <div className="modal" onClick={() => MemeStore.unsetShowMeme()}>
 console.log(Memestore.showMeme.meme.comments);
 <div className="modal-content">
 <img className="center-img" src={MemeStore.showMeme.meme.media}/>
 <div>
 {this.renderComments()}
 </div>
 </div>
 </div>
 */

export default MemeModal;
