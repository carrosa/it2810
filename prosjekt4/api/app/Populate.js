/*
 *
 *
 *
 * REMOVE BEFORE PROD
 * THIS IS SO WE CAN EASILY MAKE CHANGES TO THE DATABASE
 *
 *
 *
 * */

import express from 'express';
import * as data from '../db.json';
import Meme from './models/Meme';
import User from './models/User';
import Comment from './models/Comment';

const PopulateRouter = express.Router(); // Get instance of the express router

// Populate memes
PopulateRouter.route('/populate/memes')
    .post((req, res) => {
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
          ups: Math.floor(Math.random() * 701),
          media: data[key].media,
          nsfw: isNSFW,
          comments: [],
          usrUps: [],
          usrDowns: []
        });
        meme.save();
      });
    });


// Populate comments
PopulateRouter.route('/populate/comments')
    .post((req, res) => {
      const amount = 10;
      const testComments = [
        'Nano er den beste editoren',
        'Hallvard trætteberg er en fantastisk foreleser',
        'Eclipse > Intellij'
      ];

      User.findById('5bec179451bf97b9b34f50ad', (err, user) => {
        if (err) res.send(err);
        testComments.forEach((tc, i) => {
          const comment = new Comment({
            comment: tc,
            author: user._id
          });
          comment.save((err) => {
            if (err) res.send(err);
            Meme.find((err, memes) => {
              if (err) res.send(err);
              memes.forEach(meme => {
                meme.comments.push(comment);
                meme.save();
              });
            });
          });
        });
        return res.json({success: true});
      });
    });


export default PopulateRouter;