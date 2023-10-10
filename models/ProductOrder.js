import mongoose from 'mongoose';

const productOrderSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const ProductOrder = mongoose.model('ProductOrder', productOrderSchema);

export default ProductOrder;