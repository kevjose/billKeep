const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/users", async (req, res) => {
  const auth = req.currentUser;
  if (auth) {
    const users = await User.find({});
    return res.json(users.map((user) => user.toJSON()));
  }
  return res.status(403).send("Not authorized");
});

usersRouter.post("/users", (req, res) => {
  const auth = req.currentUser;
  if (auth) {
    const user = new User(req.body);
    const savedUser = user.save();

    return res.status(201).json(savedUser);
  }
  return res.status(403).send("Not authorized");
});

module.exports = usersRouter;
