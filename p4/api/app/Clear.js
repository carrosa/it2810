
import express from 'express';
import Meme from './models/Meme';
import User from './models/User';
import Comment from './models/Comment';
import * as data from '../Testdb.json';

const ClearRouter = express.Router(); // Get instance of the express router

// Destroy everything
ClearRouter.route('/drop/memes')
  .post((req, res) => {

    console.log("killing users");
    User.collection.drop();
    console.log("drop all memes")
    Meme.collection.drop();
    return res.json({'hei':'hei'})
  
  });

ClearRouter.route('/test/memes')
    .post((req, res) => {

      console.log("adding test user")
      const userAfter = new User({
        username: "test",
        password: "test"
      });
      userAfter.save();
    
      console.log("adding test memes")
      Object.keys(data).forEach(key => {
          const isNSFW = data[key].thumbnail.thumbnail === 'nsfw';
          const meme = new Meme({
              title: data[key].title,
              thumbnail: {
                thumbnail: data[key].thumbnail.thumbnail,
                height: data[key].thumbnail.height,
                width: data[key].thumbnail.width
              },
              created_utc: data[key].created_utc,
              author: data[key].author,
              ups: Math.floor(Math.random() * 0),
              media: data[key].media,
              nsfw: isNSFW,
              comments: [],
              usrUps: [],
              usrDowns: []
            });
            meme.save();
          });
          return res.json({'hei':'hei'})
          console.log("all done")
    });

ClearRouter.route('/token/memes')
    .post((req, res) => {

  
      console.log("adding before user")
      const userBefore = new User({
        username: "TOKENUSER",
        password: "TOKENUSER"
      });
      userBefore.save();

      console.log("adding token mems")
      Object.keys(data).forEach(key => {
        const isNSFW = data[key].thumbnail.thumbnail === 'nsfw';
        const meme = new Meme({
          title: data[key].title,
          thumbnail: {
            thumbnail: data[key].thumbnail.thumbnail,
            height: data[key].thumbnail.height,
            width: data[key].thumbnail.width
          },
          created_utc: data[key].created_utc,
          author: data[key].author,
          ups: Math.floor(Math.random() * 0),
          media: data[key].media,
          nsfw: isNSFW,
          comments: [],
          usrUps: [],
          usrDowns: []
        });
        meme.save();
      });
      return res.json({'hei':'hei'})
  });

      
     

export default ClearRouter;