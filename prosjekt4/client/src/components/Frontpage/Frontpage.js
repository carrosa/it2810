import {Component} from 'react';
import React from 'react';
import {decorate} from 'mobx';
import {observer} from "mobx-react";
import MemeStore from '../../services/MemeStore';
import UserStore from '../../services/UserStore';
import Card from './Card/Card';
import MemeModal from "../MemeModal/MemeModal";
import './Frontpage.scss';
import '../../styles/_buttons.scss';
import SignupForm from '../../forms/Auth/SignupForm';
import SearchForm from '../../forms/Search/SearchForm';


export default class Frontpage extends Component {

  componentDidMount() {
    // Load first meme page
    MemeStore.getMemes({}, false);
  }

  // returner en liste med bilder, satt som observer. mobx-react
  renderMemes() {
    let memeContainer = [];
    if (MemeStore.memesLoaded) {
      MemeStore.memesLoaded.forEach((meme, i) => {
        memeContainer.push(<Card key={i} index={i} meme={meme}/>);
      });
    }
    return memeContainer;
  }


  render() {
    return (
        <div>
          {UserStore.modal.length > 0 && (<div><SignupForm/></div>)}
          {MemeStore.showMeme.modal && (<div><MemeModal/></div>)}
          {MemeStore.search && (<SearchForm/>)}
          <div className="card-container">
            {this.renderMemes()}
          </div>
          <div className="footer">
            <button className="btn btn-default" onClick={() => MemeStore.getMemes(MemeStore.query, false)}>Load more</button>
          </div>
        </div>);
  }
}

// Sets render() as a mobx observer
decorate(Frontpage, {
  render: observer
});
