import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import '../pages/login/sing-up' // Autenticacion

const firebaseConfig = {
  apiKey: "AIzaSyCdQvgdfBV1MESRPFeXJokJBAA1ZlaTcxk",
  authDomain: "recconappprojec.firebaseapp.com",
  databaseURL: "https://recconappprojec-default-rtdb.firebaseio.com",
  projectId: "recconappprojec",
  storageBucket: "recconappprojec.appspot.com",
  messagingSenderId: "282630349232",
  appId: "1:282630349232:web:82e71f7e7fc289a650f675",
  measurementId: "G-H25RPCX5C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

console.log("hello from FireBase conecct")






