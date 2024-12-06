import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  
  //CREDENCIALES DE FIREBASE
// apiKey: "AIzaSyBjxYPPHzlZYjQFPw_bqUzkfUWMVU0pQ8g",
// authDomain: "comision-e8083.firebaseapp.com",
// projectId: "comision-e8083",
// storageBucket: "comision-e8083.firebasestorage.app",
// messagingSenderId: "616530403049",
// appId: "1:616530403049:web:1c493456d3965215545a78"

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
