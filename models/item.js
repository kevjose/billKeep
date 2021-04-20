const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  board_id: mongoose.Types.ObjectId,
  labels: [String],
  itemImageUrl: String,
  cloudinary_public_id: String,
  amount: Number,
  itemDate: { type: Date, default: Date.now },
});

itemSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Item", itemSchema);
