// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTJlQPoAk2KoftMOlrDIAeq_aAwMmszxw",
  authDomain: "soccer-field-f7eab.firebaseapp.com",
  projectId: "soccer-field-f7eab",
  storageBucket: "soccer-field-f7eab.appspot.com",
  messagingSenderId: "155266704909",
  appId: "1:155266704909:web:4c58ada08922ccca891744",
  measurementId: "G-2PKRS36CTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

