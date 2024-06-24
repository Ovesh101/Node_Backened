import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image:String
  // Add more fields as necessary
});

export default mongoose.model('Product', productSchema , "Products" );


