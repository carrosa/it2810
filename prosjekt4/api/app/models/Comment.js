import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Comment schema
const CommentSchema = new Schema({
  comment: String,
  author: {
    type: Schema.Types.ObjectId, // Foreign key referencing User
    ref: 'User',
    index: true
  },
  created: Date
});

CommentSchema.pre('save', function(next) {
  if (!this.created) this.created = new Date();
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
