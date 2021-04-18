require("dotenv").config();
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET,
  firebaseConfig: process.env.FIREBASE_CREDS,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
