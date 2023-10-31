import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  _id: {
    type: String,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cartID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
