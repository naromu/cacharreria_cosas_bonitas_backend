import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  cartID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;