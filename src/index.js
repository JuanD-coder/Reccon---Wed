import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

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
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

console.log("Hello from fire base")