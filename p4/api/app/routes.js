import express from 'express';
import AuthController from './controllers/AuthController';
import MemeController from './controllers/MemeController';
import CommentController from './controllers/CommentController';
import PassportManager from './config/passport';

const router = express.Router();

// Login/signup
router.post('/auth/signup', AuthController.signUp);
router.post('/auth/signin', AuthController.signIn);

// Memes
router.get('/memes', MemeController.getPage);
router.get('/memes/search', MemeController.search);
router.get('/memes/:id', MemeController.getWithID); // Uses meme ID
router.post('/memes/:id/vote', // Uses meme ID
    PassportManager.authenticate, MemeController.vote);
router.post('/memes/:id/create_comment', // Uses meme ID
    PassportManager.authenticate, CommentController.create);
router.post('/comments/:id/edit', // Uses Comment ID
            PassportManager.authenticate, CommentController.edit);


module.exports = router;
