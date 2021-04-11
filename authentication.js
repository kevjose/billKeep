const admin = require("firebase-admin");
const firebaseConfig = require("./config/keys").firebaseConfig;

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(Buffer.from(firebaseConfig, "base64").toString("ascii"))
  ),
});

async function decodeIDToken(req, res, next) {
  const header = req.headers?.authorization;
  if (
    header !== "Bearer null" &&
    req.headers?.authorization?.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    let checkRevoked = true;
    try {
      const decodedToken = await admin
        .auth()
        .verifyIdToken(idToken, checkRevoked);
      console.log(decodedToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

module.exports = decodeIDToken;
