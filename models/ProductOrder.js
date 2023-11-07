import mongoose from "mongoose";

const productOrderSchema = new mongoose.Schema({
  productId: {
    type: String,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

const ProductOrder = mongoose.model("ProductOrder", productOrderSchema);

export default ProductOrder;
