import Product from "../models/ProductModel.js"
import User from "../models/UserModel.js"
import Cart from "../models/cartModel.js";
import Payment from "../models/PaymentModel.js"

export const getAllProducts = async (req , res)=>{
    try {
        const products = await Product.find({});
        res.status(200).json({products:products });
        console.log("All products" , products);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }

}

export const getProductById = async (req , res)=>{
    const { id } = req.params;
    
    try {
      const SingleProduct =  await Product.findById(id);
      console.log(SingleProduct);
       res.status(200).json({ SingleProduct });
      
    } catch (error) {
      res.status(500).json({ message: error.message });
      
    }
 

}
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// controllers/userController.js

export const updateUserCart = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.cartItems.includes(productId)) {
      return res.status(200).json({ msg: 'Product already in cart', user });
    }

    user.cartItems.push(productId);
    await user.save();

    res.status(200).json({ msg: 'Product added to cart', user });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


export const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you're using authentication middleware
    const { productId } = req.params;

    // Find the user by userId and update the cartItems array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { cartItems: productId } },
      { new: true }
    );

    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ msg: 'Item removed', user: updatedUser });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Checkout page

export const checkout = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const { userId } = req.user;

    // Find existing cart for the user
    let existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      // Check each cartItem to avoid duplicates
      cartItems.forEach(newItem => {
        const isItemExist = existingCart.items.some(item => item.productId === newItem.productId);

        console.log("Item Exisist" , isItemExist);

        if (!isItemExist) {
          existingCart.items.push(newItem);
        }
      });

      await existingCart.save();
    } else {
      // Create new cart if no existing cart found
      const newCart = new Cart({
        userId,
        items: cartItems,
      });
      await newCart.save();
      existingCart = newCart; // Set existingCart to newCart for response
    }

    res.status(201).json({ message: 'Cart updated successfully', cart: existingCart });
  } catch (error) {
    console.error('Error saving/updating cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const paymentGateway = async (req, res) => {
  try {
    const {  firstName, lastName, email, address, paymentMethod } = req.body;
    const {id} = req.params;
    console.log("cartId" , id);
    const {userId} = req.user

  

    // Step 2: Create a new payment document linked to the cart
    const payment = new Payment({
      firstName,
      lastName,
      email,
      address,
      paymentMethod,
      cartId: id ,
      userId:userId
    });
    await payment.save();

    const cart = await Cart.findOne({ _id: id });
    
    if (cart) {
      // Set the userId to null
      cart.userId = null;
      await cart.save();
      console.log('User ID removed from cart successfully.');
    } else {
      console.log('Cart not found.');
    }

    const user = await User.findOne({_id:userId});
    if(user){
      user.cartItems = []
      await user.save();
    }

    res.status(201).send({ message: 'Payment information saved successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Failed to save payment information', error });
  }
};



