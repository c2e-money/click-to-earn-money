import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLEBJE7Y_Lq33NIq-HczZo-VTaIPTNkko",
  authDomain: "my-link-shorter-website.firebaseapp.com",
  databaseURL: "https://my-link-shorter-website-default-rtdb.firebaseio.com",
  projectId: "my-link-shorter-website",
  storageBucket: "my-link-shorter-website.firebasestorage.app",
  messagingSenderId: "938373655771",
  appId: "1:938373655771:web:7b8503ad19eb27d7ab70fe",
  measurementId: "G-PFXLSEGH4V"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
