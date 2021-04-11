const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const decodeIDToken = require("./authentication");
const usersRouter = require("./controllers/users");
const app = express();
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err.message);
  });
app.use(cors());
app.use(express.json());
app.use(decodeIDToken);

app.use("/api", usersRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});