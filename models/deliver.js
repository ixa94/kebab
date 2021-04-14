const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  deliverName: { type: String, unique: true, required: true },
  deliverEmail: { type: String, unique: true, required: true },
  deliverPassword: { type: Number, required: true },
  deliverPhone: { type: Number, required: true },
});

module.exports = mongoose.model("Deliver", userSchema);
