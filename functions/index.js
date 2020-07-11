const functions = require("firebase-functions");
const admin = require("firebase-admin");
var cors = require("cors")({ origin: true });

var vapidPrivateKey = "QzZ21Vpi2a09lAQVJu343ub2kzc8w8ZZYw3FFSIeue8";

admin.initializeApp({
  databaseURL: "url for your realitime db",
  credential: admin.credential.cert(
    require("/path/to/keyfilegeneratedfromFirebaseRealtimeDB")
  ),
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storePostData = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin
      .database()
      .ref("posts")
      .push({
        id: request.body.id,
        title: request.body.title,
        location: request.body.location,
        image: request.body.image,
      })
      .then(() => {
        return response
          .status(201)
          .json({ message: "Data stored", id: request.body.id });
      })
      .catch((err) => {
        response.status(500).json({ error: err });
      });
  });
});
