const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  deliverName: { type: String, required: true },
  deliverEmail: { type: String, unique: true, required: true },
  deliverPassword: { type: String, required: true },
  deliverPhone: { type: Number, required: true },
});

module.exports = mongoose.model("Deliver", userSchema);
