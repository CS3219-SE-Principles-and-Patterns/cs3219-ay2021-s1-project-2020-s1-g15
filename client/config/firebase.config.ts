// firebase must only be initialised in client, not server:
// Config file
import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBmao_BVprF9zU2_FFIZZDxIEvuqZ2HWus",
  authDomain: "answerleh.firebaseapp.com",
  databaseURL: "https://answerleh.firebaseio.com",
  projectId: "answerleh",
  storageBucket: "answerleh.appspot.com",
  messagingSenderId: "896806835090",
  appId: "1:896806835090:web:dd3713e71eb0343326674b",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export default auth;
