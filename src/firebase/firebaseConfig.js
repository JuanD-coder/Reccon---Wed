import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

console.log("Se conecto con FireBase")




