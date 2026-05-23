import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAW4JRvs_gwVHM1R8NJqfpB_toYIIZjWl0",
  authDomain: "authapp-e44f9.firebaseapp.com",
  projectId: "authapp-e44f9",
  storageBucket: "authapp-e44f9.appspot.com",
  messagingSenderId: "102646770113",
  appId: "1:102646770113:web:1eeb323aa47269ac0a6740",
  measurementId: "G-YND4R4909J"
};

const app = initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(app);

// DATABASE
export const db = getFirestore(app);