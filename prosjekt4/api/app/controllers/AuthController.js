import config from '../config/db';
import User from "../models/User";

const jwt = require('jsonwebtoken');

class AuthController {
  // Create user
  signUp(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.json({success: false, error: 'Missing username and/or password'});
    } else {
      let newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save(err => {
        if (err) {
          return res.json({error: err.message});
        }
        return res.json({success: true, user: req.body.username});
      });
    }
  }

  // Login user
  signIn(req, res) {
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.status(401).send({success: false, error: 'Authentication failed. User not found.'});
      } else {
        // Check if password matches
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            // If user is found and password is correct, create a token
            const token = jwt.sign(user.toJSON(), config.secret, {expiresIn: '12h'});
            // return success status and token
            return res.json({success: true, token: 'JWT ' + token, user: req.body.username});
          } else {
            return res.status(401).send({success: false, error: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  }
}

// Export as new Auth because we want a new instance of Auth each time it is called
export default new AuthController();