import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const UserSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
     
      minlength: [6, 'Password must be at least 6 characters long'],
      required: [function() { return !this.googleId; }, 'Password is required'],
      
    },
    cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
    googleId: {
      type: String,
      unique: true,
      sparse: true
  }

  });



export default mongoose.model('User', UserSchema);