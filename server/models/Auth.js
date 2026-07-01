import mongoose from 'mongoose';

const AuthSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
});

const Auth = mongoose.model('Auth', AuthSchema);

export default Auth;
