import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;