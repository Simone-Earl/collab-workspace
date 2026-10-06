// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REPLACE this object with your actual config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCojsYqtY6vG6aLGF8uxtx-MKr8gSJ4dqA",
  authDomain: "collabworkspace-87087.firebaseapp.com",
  projectId: "collabworkspace-87087",
  storageBucket: "collabworkspace-87087.firebasestorage.app",
  messagingSenderId: "218912200803",
  appId: "1:218912200803:web:a1c9c9c61008131c178056"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);