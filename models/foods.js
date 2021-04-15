const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  place: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  discountPrice: { type: Number },
  deliver: {type: String},
});

module.exports = mongoose.model('Order', userSchema);
