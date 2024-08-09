// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLCWV5-vSVtF-tkk4-BtoiBvJvn0woDsY",
  authDomain: "inventory-management-c6ea4.firebaseapp.com",
  projectId: "inventory-management-c6ea4",
  storageBucket: "inventory-management-c6ea4.appspot.com",
  messagingSenderId: "419572917456",
  appId: "1:419572917456:web:e030ab6ced578074426ad5",
  measurementId: "G-MF62PBHSKC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
