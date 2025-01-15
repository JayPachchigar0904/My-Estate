// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "my-estate-5d197.firebaseapp.com",
  projectId: "my-estate-5d197",
  storageBucket: "my-estate-5d197.firebasestorage.app",
  messagingSenderId: "702769337424",
  appId: "1:702769337424:web:5ae10d01f5c9d62330ad55"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);