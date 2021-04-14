const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/user", async (req, res) => {
  const auth = req.currentUser;
  if (auth) {
    const user = await User.findOne({});
    return res.json(user);
  }
  return res.status(403).send("Not authorized");
});

usersRouter.post("/user", (req, res) => {
  const auth = req.currentUser;
  if (auth) {
    const user = new User(req.body);
    const savedUser = user.save();

    return res.status(201).json(savedUser);
  }
  return res.status(403).send("Not authorized");
});

module.exports = usersRouter;
