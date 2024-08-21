import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
/////project-66868234508
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkRwX_2viKdyFaeomkCv5agZnzdIkAZFw",
  authDomain: "yesgobus-4ebce.firebaseapp.com",
  projectId: "yesgobus-4ebce",
  storageBucket: "yesgobus-4ebce.appspot.com",
  messagingSenderId: "66868234508",
  appId: "1:66868234508:web:14703fee8faef2f1d9e129",
  measurementId: "G-BCQHXHK1WB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}
//const analytics = getAnalytics(app);