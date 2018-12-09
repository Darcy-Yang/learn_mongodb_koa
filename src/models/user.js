import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: Schema.Types.ObjectId,
  name: String,
  password: String,
  createdAt: Date,
});

const User = mongoose.model('user', userSchema);

export default User;
