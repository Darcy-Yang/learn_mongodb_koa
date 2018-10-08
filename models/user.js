import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  token: String,
  userId: Schema.Types.ObjectId,
  name: String,
  password: String,
  avatarUrl: String,
});

const User = mongoose.model('user', UserSchema);

export default User;
