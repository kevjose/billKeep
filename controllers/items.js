const itemsRouter = require("express").Router();
const Item = require("../models/item");
const cloudinary = require("cloudinary");
const config = require("../config/keys");
var multer = require("multer");
var uploads = multer({ dest: "/tmp/" });

const fs = require("fs-extra");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

itemsRouter.get("/item/:board_id", async (req, res) => {
  const auth = req.currentUser;
  if (auth) {
    const labels = await Item.aggregate([
      {
        $match: {
          board_id: mongoose.Types.ObjectId(req.params.board_id),
        },
      },
      { $unwind: "$labels" },
      {
        $group: {
          _id: "$labels",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
    const items = await Item.find({
      board_id: mongoose.Types.ObjectId(req.params.board_id),
    });
    return res.json({ items, labels });
  }
  return res.status(403).send("Not authorized");
});

itemsRouter.post("/item", uploads.single("itemImageUrl"), async (req, res) => {
  const auth = req.currentUser;
  const {
    name,
    description,
    board_id,
    labels,
    cloudinary_public_id,
    amount,
    itemDate,
  } = req.body;
  if (auth) {
    try {
      const result =
        req?.file?.path &&
        (await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "bill_keep/items",
        }));

      const response = await Item.create({
        board_id: mongoose.Types.ObjectId(board_id),
        name,
        description,
        labels,
        itemImageUrl: result?.secure_url || null,
        cloudinary_public_id: result?.public_id || null,
        amount,
        itemDate,
      });

      req?.file?.path && (await fs.unlink(req.file.path));
      if (cloudinary_public_id) {
        await cloudinary.v2.uploader.destroy(cloudinary_public_id);
      }
      console.log(response);
      return res.status(201).json(response);
    } catch (e) {
      return res.status(503).send(e.message);
    }
  }
  return res.status(403).send("Not authorized");
});

module.exports = itemsRouter;
