const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  place: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
discountPrice:{ type: Number}
});

module.exports = mongoose.model("Order", userSchema);
