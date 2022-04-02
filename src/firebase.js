import firebase from 'firebase/compat';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCtLqFCjwDHY7FloF_kDG1WrDuKgknyCo",
  authDomain: "react-slack-clone-84e1d.firebaseapp.com",
  databaseURL: "https://react-slack-clone-84e1d-default-rtdb.firebaseio.com",
  projectId: "react-slack-clone-84e1d",
  storageBucket: "react-slack-clone-84e1d.appspot.com",
  messagingSenderId: "1086374017800",
  appId: "1:1086374017800:web:362f7844c425dc61150abd",
  measurementId: "G-Z97W6XC6BJ"
};
firebase.initializeApp(firebaseConfig);



export default firebase;


