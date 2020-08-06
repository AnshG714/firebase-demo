const db = require("./functions/db-config");
const admin = require("firebase-admin");

const fellowRef = db.collection("fellow-data");

function addFellow(id, name, pod, favLanguages, team) {
  return new Promise((resolve, reject) => {
    fellowRef
      .doc(id)
      .set({
        name,
        pod,
        favLanguages,
        team,
      })
      .then(() => resolve())
      .catch((err) => {
        console.log(err);
        reject(new Error("Something went wrong"));
      });
  });
}

function modifyProgrammingLanguage(id, language, method) {
  const arrayFunc =
    method === "add"
      ? admin.firestore.FieldValue.arrayUnion
      : admin.firestore.FieldValue.arrayRemove;
  return new Promise((resolve, reject) => {
    fellowRef
      .doc(id)
      .update({
        favLanguages: arrayFunc(language),
      })
      .then(() => resolve())
      .catch(() => reject());
  });
}

function getIndividualData(id) {
  return new Promise((resolve, reject) => {
    fellowRef
      .doc(id)
      .get()
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          return console.log("This document doesn't exist");
        }
        console.log(docSnapshot.data());
      });
  });
}

function getAllData() {
  fellowRef.get().then((querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(data);
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    fellowRef
      .doc(id)
      .delete()
      .then(() => resolve)
      .catch(() =>
        reject(new Error("Something went wrong when removing this user"))
      );
  });
}

function transactionDemo(id) {
  return new Promise((resolve, reject) => {
    db.runTransaction(async (transaction) => {
      const doc = await transaction.get(fellowRef.doc(id));
      const data = doc.data();

      if (data.team === "RNTester") {
        await transaction.set(
          fellowRef.doc(id),
          {
            awesome: true,
          },
          { merge: true }
        );
      } else {
        await transaction.set(
          fellowRef.doc(id),
          {
            awesome: false,
          },
          { merge: true }
        );
      }
    })
      .then(() => console.log("Yay"))
      .catch(() => console.log("oops"));
  });
}

function cleanerUpdate(id) {
  fellowRef
    .where("team", "==", "RNTester")
    .get()
    .then(async (querySnapshot) => {
      await Promise.all(
        querySnapshot.docs.map((doc) => {
          doc.ref.set(
            {
              awesome: "true",
            },
            { merge: true }
          );
        })
      );
    });
}

// addFellow(
//   "Ansh Godha",
//   "Ansh Godha",
//   "0.4.2",
//   ["JavaScript", "OCaml", "Swift"],
//   "RNTester"
// );

// addFellow(
//   "jevakallio",
//   "Jani Evakallio",
//   "0.4.2",
//   ["JavaScript", "PHP"],
//   "React JSON Schema Form"
// );

// addFellow(
//   "sidsh",
//   "Siddharth Sham",
//   "0.4.2",
//   ["JavaScript", "HackLang"],
//   "Relay"
// );

// addFellow(
//   "chiragsinghal",
//   "Chirag Singhal",
//   "0.4.1",
//   ["Java", "PHP"],
//   "RNTester"
// );

// modifyProgrammingLanguage("Ansh Godha", "OCaml", "remove");

// getIndividualData("jevakallio");

// getAllData();

// deleteUser("jevakallio");

// transactionDemo("jevakallio");

cleanerUpdate("sidsh");
cleanerUpdate("chiragsinghal");
