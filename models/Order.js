import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductOrder'
  }]
},
{
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;