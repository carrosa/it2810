import Comment from '../models/Comment';
import Meme from '../models/Meme';


class CommentController {
  // Create a new comment on a meme
  create(req, res) {
    if (!req.body.comment || !req.params.id) {
      return res.json({success: false, msg: 'Missing comment or you are not logged in'});
    }
    const comment = new Comment({
      comment: req.body.comment,
      author: req.user
    });
    comment.save(err => {
      if (err) res.json(err);
      Meme.findById(req.params.id, (err, meme) => {
        console.log(meme);
        if (err) return res.json(err.message);

        meme.comments.push(comment);
        if (!meme.comment_count) {
          meme.comment_count = 1;
        } else {
          meme.comment_count += 1;
        }
        meme.save(err => {
          if (err) return res.json(err.message);
          return res.json({success: true, created: comment, updated: meme});
        });
      });
    });
  }

  // Edit comment
  edit(req, res) {
    if (!req.body.comment || !req.params.id) {
      return res.json({success: false, msg: 'Missing comment or you are not logged in'});
    }
    Comment.findById(req.params.id, (err, comment) => {
      if (err) return res.json(err);
      // For some reason I have to convert the values to string (or use "=="). If not this will never evaluate true
      else if (JSON.stringify(comment.author) !== JSON.stringify(req.user.id)) {
        return res.json({success: false, msg: 'Wrong user!', user: req.user});
      }
      // For some reason I have to convert the values to string (or use "=="). If not this will never evaluate true
      comment.comment = req.body.comment;
      comment.save(err => {
        if (err) return res.json({success: false, msg: 'Missing comment or you are not logged in'});
        return res.json({success: true, updated: `${comment.id}`});
      }).catch(err => err.message);
    });
    /*
     Comment.findByIdAndUpdate(
     req.params.id,
     {comment: req.body.comment},
     (err, comment) => {
     if (err) return res.json(err.message);
     else return res.json({success: true, updated: `${comment.id}`});
     }
     );*/
  }
}

/*
 * Returns true if user can edit this comment.
 * Returns false if not.
 */
function userCanEdit(req, res) {
  return Comment.findById(req.params.id, (err, comment) => {
    if (err) return res.json(err);
    // For some reason I have to convert the values to string (or use "=="). If not this will never evaluate true
    return JSON.stringify(comment.author) === JSON.stringify(req.user.id);
  });
}

export default new CommentController();

// Test meme
// 5be1a3b6dc3bf9974127f81b