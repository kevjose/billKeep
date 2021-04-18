const boardsRouter = require("express").Router();
const Board = require("../models/board");
const cloudinary = require("cloudinary");
const config = require("../config/keys");
var multer = require("multer");
var uploads = multer({ dest: "/tmp/" });

const fs = require("fs-extra");
const { auth } = require("firebase-admin");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

boardsRouter.get("/board", async (req, res) => {
  const auth = req.currentUser;
  if (auth) {
    const boards = await Board.find({
      $or: [{ owner: auth.phone_number }, { collaborators: auth.phone_number }],
    });
    return res.json(boards);
  }
  return res.status(403).send("Not authorized");
});

boardsRouter.post(
  "/board",
  uploads.single("boardCoverImage"),
  async (req, res) => {
    const auth = req.currentUser;
    const {
      name,
      description,
      color,
      collaborators,
      id,
      cloudinary_public_id,
    } = req.body;
    if (auth) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "bill_keep/boards",
      });
      console.log(result);
      const query = { owner: auth.phone_number };
      if (id) {
        query["_id"] = mongoose.Types.ObjectId(id);
      }
      console.log(query);
      const response = await Board.findOneAndUpdate(
        query,
        {
          $set: {
            name,
            description,
            color,
            collaborators,
            boardCoverUrl: result.secure_url,
            cloudinary_public_id: result.public_id,
          },
        },
        { new: true, upsert: true }
      );
      await fs.unlink(req.file.path);
      if (cloudinary_public_id) {
        await cloudinary.v2.uploader.destroy(cloudinary_public_id);
      }
      console.log(response);
      return res.status(201).json(response);
    }
    return res.status(403).send("Not authorized");
  }
);

module.exports = boardsRouter;
