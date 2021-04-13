import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    // this id from project settings in firebase
    apiKey: "AIzaSyDa1zV5TavXzb57bc_B7m95tKPPx3Hm04w",
    authDomain: "instagram-clone-7f100.firebaseapp.com",
    databaseURL: "https://instagram-clone-7f100-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-7f100",
    storageBucket: "instagram-clone-7f100.appspot.com",
    messagingSenderId: "808266679531",
    appId: "1:808266679531:web:7c5450fd5b8c1f74a76aae",
    measurementId: "G-EL2LJ1QHWG"

  });

  
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage}
