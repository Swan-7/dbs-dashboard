import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
var firebaseConfig = {
  apiKey: "AIzaSyCeU4jUut1CdmTKpF4ZD8TFUIUIQ_CWncQ",
  authDomain: "drug-distribution-system.firebaseapp.com",
  projectId: "drug-distribution-system",
  storageBucket: "drug-distribution-system.appspot.com",
  messagingSenderId: "881754597543",
  appId: "1:881754597543:web:779fba1c226c2c8b805382",
  measurementId: "G-6CKHFKLC12",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const fieldValue = firebase.firestore.FieldValue;
export const auth = firebase.auth();
export const storage = firebase.storage();
export const db = firebase.firestore();
