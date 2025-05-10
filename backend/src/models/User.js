import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: { 
    type: String, 
    // Don't validate password at schema level since we have existing users
    // and we're adding OAuth support after the fact
    required: false
  },
  googleId: { type: String },
  githubId: { type: String },
  avatar: { type: String },
  role: { 
    type: String, 
    default: 'user',
    enum: ['user', 'admin']
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  }
}, { timestamps: true });

// Hash password before saving (only if password field is modified)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;