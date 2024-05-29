import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

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

/* Initialize Firebase */
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storege = getStorage();
const analytics = getAnalytics(app);

logEvent(analytics, 'notification_received');

console.log("Se conecto con FireBase DB")




