import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3Yl0BR4o6qEX6MeXYjX6Qjlr5BCid5C8",
  authDomain: "my-website-242fc.firebaseapp.com",
  projectId: "my-website-242fc",
  storageBucket: "my-website-242fc.firebasestorage.app",
  messagingSenderId: "78108710064",
  appId: "1:78108710064:web:7b5e79f33721fbc7f71775"
};

// Yeh line check karti hai ki app pehle se chaalu toh nahi hai (Crash se bachne ke liye)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Database (links ke liye) aur Auth (login ke liye) ko chaalu karna
const db = getFirestore(app);
const auth = getAuth(app);

// Inko export karna zaroori hai taaki baaki pages inka use kar sakein
export { db, auth };
