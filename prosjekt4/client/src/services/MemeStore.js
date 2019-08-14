import {observable, decorate, action} from 'mobx';
import APIService from './APIService';
import UserStore from './UserStore';


class MemeStore {
  constructor() {
    this.api = new APIService();
    this.memesLoaded = [];
    this.query = {
      page: 0
    };
    this.search = false;
    this.showMeme = {
      modal: false,
      meme: null,
      index: 0
    };
    this.comment = '';
  }

  // Helper method to generate a query string
  generateQuery(query) {
    query['page'] = this.query.page;
    this.query.page++;
    this.query = query; // keeps track of query
    let queryString = '';
    Object.keys(query).forEach(key => {
      if (query[key]) {
        queryString += queryString.length > 0 ? '&' : ''; // If query already in querySTring, add '&'
        queryString += key + '=' + query[key]; // Add key/value pair to queryString
      }
    });
    return queryString.length > 0 ? '?' + queryString : ''; // Append '?' to beginning of querystring if not empty
  }

  // Gets memes
  getMemes(query, isNewSearch) {
    if (isNewSearch) this.memesLoaded = [];
    this.nextPage = 0; // Empties memesLoaded if new search, sets nextPage to 0
    this.api.getMemes(this.generateQuery(query)).then(res => {
      res.forEach(meme => this.memesLoaded.push(meme));
    }).catch(err => console.error(err)).finally(() => this.search = false);
  }

  update(page) {
    this.api.getMemesByPage(page).then(res => {
      res.forEach(meme => this.memesLoaded.push(meme));
    }).then(this.nextPage++).catch(err => console.error(err));
  }

  // TODO: optimize this, add index to shown meme so
  // we dont have to itereate trough memsLoaded every
  // time we look for next or prev meme. 
  // this way we only need to find the index the first
  // time a meme is pressed. ++ legg til break i forloop. 
  showNextMeme() {
    const newIndex = this.showMeme.index + 1 < this.memesLoaded.length ? this.showMeme.index + 1 : 0;
    this.setShowMeme(this.memesLoaded[newIndex]._id, newIndex);
  }

  showPrevMeme() {
    const newIndex = this.showMeme.index - 1 > 0 ? this.showMeme.index - 1 : this.memesLoaded.length - 1;
    this.setShowMeme(this.memesLoaded[newIndex]._id, newIndex);
  }

  // Votes and updates memesloaded
  vote(meme, type, token) {
    this.api.vote(meme._id, type, token).then(res => {
      const index = this.memesLoaded.indexOf(meme);
      if (res.success) {
        this.memesLoaded[index] = res; // change to be equal to res if successful
      }
    }).catch(err => console.error(err));
  }


  setShowMeme(id, index) {
    this.api.getMeme(id).then(res => {
      this.showMeme = {
        modal: true,
        meme: res,
        index: index
      };
      console.log(this.showMeme);
      console.log(this.showMeme.meme.media);
    }).catch(err => console.error(err));
  }

  unsetShowMeme() {
    console.log("memegone");
    this.showMeme = {
      modal: false,
      meme: null,
      index: 0
    };
  }

  setSearch() {
    this.search = !this.search;
  }

  postComment(memeid, token, comment) {
    if (comment.length > 0) {
      this.api.postComment(memeid, token, comment).then(res => {
        if (res.success === true) {
          console.log(res.updated);
          this.showMeme.meme.comments.push(res.created);
          this.comment = '';
        } else {
          console.log(res);
        }
      });
    }
  }

  updateComment(e) {
    this.comment = e.target.value;
  }

}

decorate(MemeStore, {
  update: action,
  unsetShowMeme: action,
  setShowMeme: action,
  vote: action,
  setSearch: action,
  generateQuery: action,
  getMemes: action,
  postComment: action,
  updateComment: action,
  comment: observable,
  query: observable,
  memesLoaded: observable,
  nextPage: observable,
  showMeme: observable,
  search: observable
});

export default new MemeStore();
