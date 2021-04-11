require("dotenv").config();
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET,
  firebaseConfig: process.env.FIREBASE_CREDS,
};
