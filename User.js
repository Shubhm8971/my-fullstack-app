import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['guest', 'admin'], 
    default: 'guest' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', UserSchema);

export default User;