const functions = require("firebase-functions");
const db = require("./db-config");
const admin = require("firebase-admin");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.myFunction = functions.firestore
  .document("fellow-data/{userID}")
  .onUpdate((change, context) => {
    console.log(context.params.userID);
    return db
      .collection("cloud-functions-demo")
      .doc("data")
      .update({
        count: admin.firestore.FieldValue.increment(1),
      });
  });
