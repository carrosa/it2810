import {Component} from 'react';
import React from 'react';
import {decorate} from 'mobx';
import {observer} from 'mobx-react';
import './Card.scss';
import MemeStore from '../../../services/MemeStore';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp, faChevronDown, faCommentDots} from '@fortawesome/free-solid-svg-icons';
import UserStore from '../../../services/UserStore';

export default class Card extends Component {

  convertNumber(num, decimals = 0) {
    let unit = "";
    let divider = 1;
    if (num < 10 ** 3) {
      //pass
    } else if (num < 10 ** 6) {
      divider = 10 ** 3;
      unit = "k";
    } else {
      divider = 10 ** 6;
      unit = "m";
    }
    let formated_num = Math.floor(10 ** decimals * num / divider) / 10 ** decimals;
    return formated_num.toString() + unit;
  }

  render() {
    return (
        <div className="card">
          <h3 className="card--title">{this.props.meme.title}</h3>
          <img className="card--image" onClick={() => MemeStore.setShowMeme(this.props.meme._id, this.props.index)}
               src={this.props.meme.thumbnail.thumbnail} alt="NSWF"/>
          <div className="card--metadata">
            <div className="card--metadata--info">
              <div className="card--metadata--info--voting">
                <div className="card--metadata--info--voting--vote">
                  <div onClick={() => MemeStore.vote(this.props.meme, 1, UserStore.user.token)}>
                    <FontAwesomeIcon className="card--metadata--info--voting--vote--click card--icon"
                                     icon={faChevronUp}/>
                  </div>
                  <div onClick={() => MemeStore.vote(this.props.meme, -1, UserStore.user.token)}>
                    <FontAwesomeIcon className="card--metadata--info--voting--vote--click card--icon"
                                     icon={faChevronDown}/>
                  </div>
                </div>
                <div className="card--metadata--info--voting--amount card--icon">
                  <p>{this.convertNumber(this.props.meme.ups, 1)}</p>
                </div>
              </div>
            </div>
            <div className="card--metadata--info">
              <p className="card--metadata--info--link card--icon">
                {this.convertNumber(this.props.meme.comments.length, 1)}
                <FontAwesomeIcon className="card--icon card--comment" icon={faCommentDots}/>
              </p>
            </div>
          </div>
        </div>
    );
  }
}

decorate(Card, {
  render: observer
});
