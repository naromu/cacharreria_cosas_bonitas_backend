import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  categoryIds: [{
    type: String,
    ref: 'Category',
    required: true
  }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;