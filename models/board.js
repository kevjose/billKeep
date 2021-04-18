const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: String,
  description: String,
  color: String,
  collaborators: [String],
  boardCoverUrl: String,
  owner: String,
  cloudinary_public_id: String,
});

boardSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Board", boardSchema);
