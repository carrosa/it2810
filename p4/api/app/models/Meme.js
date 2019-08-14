import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Meme schema
const MemeSchema = new Schema({
  title: String,
  thumbnail: {
    thumbnail: String,
    height: Number,
    width: Number
  },
  nsfw: Boolean,
  created_utc: Number,
  author: String,
  ups: Number,
  media: String,
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}], // List of FKs ref Comments
  usrUps: [],
  usrDowns: [],
  comment_count: Number
});

module.exports = mongoose.model('Meme', MemeSchema);
