import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';

// Connect to database
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const updateUsers = async () => {
  try {
    // Find all users without provider field
    const users = await User.find({ provider: { $exists: false } });
    
    console.log(`Found ${users.length} users to update`);
    
    // Update each user
    for (const user of users) {
      user.provider = 'local';
      await user.save();
      console.log(`Updated user: ${user.email}`);
    }
    
    console.log('All users updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

updateUsers(); 