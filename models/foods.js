const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String ,required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  discountPrice: { type: Number },
  deliver:{type:String},
  fileName:{type:String},
  buyer:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Order', userSchema);
