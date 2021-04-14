const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/user", async (req, res) => {
  const auth = req.currentUser;
  if (auth) {
    const user = await User.findOne({ phone: auth.phone_number });
    return res.json(user);
  }
  return res.status(403).send("Not authorized");
});

usersRouter.post("/user", async (req, res) => {
  const auth = req.currentUser;
  console.log(auth, req.body);
  if (auth) {
    await User.updateOne(
      { phone: auth.phone },
      { $set: { name: req.body.name } },
      { new: true }
    );
    return res
      .status(201)
      .json({ name: req.body.name, phone: auth.phone_number });
  }
  return res.status(403).send("Not authorized");
});

module.exports = usersRouter;
