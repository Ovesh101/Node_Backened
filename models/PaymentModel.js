import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  paymentMethod: String,
  cartId: { type: mongoose.Schema.Types.ObjectId, required:true , ref: 'Cart' } ,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },// Reference to the Cart model
});

export default mongoose.model('Payment', paymentSchema);
