// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCLGkk1D3qmsnbqkkkoqfONERd_NuSAtu8",
  authDomain: "smart-emergency-response-67120.firebaseapp.com",
  projectId: "smart-emergency-response-67120",
  storageBucket: "smart-emergency-response-67120.firebasestorage.app",
  messagingSenderId: "261665794560",
  appId: "1:261665794560:web:b60a418bfa80c13372c6e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Database services for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);