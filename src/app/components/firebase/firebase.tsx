import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8ZFLGO9TKtyWIc7Oja7lEhnrKT84MdEY",
  authDomain: "myaiwiz-storage.firebaseapp.com",
  projectId: "myaiwiz-storage",
  storageBucket: "myaiwiz-storage.firebasestorage.app",
  messagingSenderId: "574850714512",
  appId: "1:574850714512:web:befba32f9d8d79948ac115",
  measurementId: "G-H1G44HZXEG",
};

// Initialize Firebase app (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
