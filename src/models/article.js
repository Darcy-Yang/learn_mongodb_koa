import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  userId: String,
  title: String,
  content: String,
  html: String,
  typeList: { type: Array, default: [] },
  tagInfo: { type: Array, default: [] },
  createdAt: Date,
});

const Article = mongoose.model('article', articleSchema);

export default Article;
