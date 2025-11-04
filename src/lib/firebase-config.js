
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATeBSWSUtHpZqvndnmomn7aeX3-B3vm7M",
  authDomain: "weeat-c8b0a.firebaseapp.com",
  databaseURL: "https://weeat-c8b0a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "weeat-c8b0a",
  storageBucket: "weeat-c8b0a.firebasestorage.app",
  messagingSenderId: "638623220459",
  appId: "1:638623220459:web:b951f76d3bcf614411f4ae",
  measurementId: "G-DX6RB3P9G4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
