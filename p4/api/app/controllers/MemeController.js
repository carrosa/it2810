import Meme from '../models/Meme';
import Comment from '../models/Comment';

/*
 * Controller class for Meme CRUD operations
 */
class MemeController {

  // Gets page with $limit amount of memes
  getPage(req, res) {
    // Pagination options
    const paginationOptions = {
      page: req.query.page || 0,
      limit: 15
    };
    Meme.find((err, memes) => {
      if (err) return res.send(err);
      return res.json(memes);
    })
        .skip(paginationOptions.page * paginationOptions.limit) // Skips x pages ahead
        .limit(paginationOptions.limit);
  }

  /*
   * Gets specific meme based on ID
   * Also populates comments so that we get the entire comment chain
   * in the response, not just the comment ID
   */
  getWithID(req, res) {
    Meme.findById(req.params.id, (err, meme) => {
      if (err) return res.send(err);
      return res.json(meme);
    })
        .populate({ // Populate nesten array for foreign keys
          path: 'comments',
          populate: {
            path: 'author',
            model: 'User'
          }
        }).then(res => console.log(res));
  }

  // votes on meme
  vote(req, res) {
    Meme.findById(req.params.id, (err, meme) => {
      if (err) return res.json(err);

      /*
       * Checks if user can vote
       * Keeps track of who has upvoted/downvoted in two different arrays.
       * Removes from one and adds the user to one if the user is eligible to vote.
       */
      if (req.body.vote === -1 && meme.usrDowns.indexOf(req.user._id) === -1) {
        meme.usrDowns.push(req.user._id);
        meme.usrUps.splice(meme.usrDowns.indexOf(req.user._id), 1);
      } else if (req.body.vote === 1 && meme.usrUps.indexOf(req.user._id) === -1) {
        meme.usrUps.push(req.user._id);
        meme.usrDowns.splice(meme.usrDowns.indexOf(req.user._id), 1);
      } else {
        // Returns message and success status false if user cannot vote
        return res.json({success: false, msg: `You cannot vote ${req.body.vote} twice`});
      }
      // Upvotes/Downvotes
      meme.ups += req.body.vote;
      meme.save(err => {
        if (err) return res.json({success: false, msg: err.message});
        return res.json({meme: meme, success: true});
      });
    });
  }

  // Function to sort and filter db
  search(req, res) {
    // Define page options
    const paginationOptions = {
      page: req.query.page || 0,
      limit: 15
    };

    let searchableQuery = {};
    let sortableQuery = {};

    // If we have any queries split them into searchable and non-searchable
    if (req.query) {
      Object.entries(req.query).forEach(([key, value]) => {
        if (['author', 'title'].includes(key)) {
          searchableQuery[key] = {$regex: '^.*' + value + '.*$', $options: 'i'};
        } else if (key === 'nsfw') {
          searchableQuery['nsfw'] = value;
        } else if (key === 'ups') {
          sortableQuery['ups'] = value;
        } else if (key === 'comment_count') {
          sortableQuery['comment_count'] = value;
        }
      });
    }

    // Run an AND statement on searchableQuery
    Meme.find({
      $and: [
        searchableQuery
      ]
    }, (err, memes) => {
      if (err) return res.json(err.message);
      return res.json(memes);
    }).sort(sortableQuery)
        .skip(paginationOptions.page * paginationOptions.limit) // Skips x pages ahead
        .limit(paginationOptions.limit); // Limits how many is shown
  }

}

export default new MemeController();
