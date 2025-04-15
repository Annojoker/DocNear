// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqttToADhMp2YAuWdNhnuK-X40wdBayLM",
  authDomain: "docnear-67873.firebaseapp.com",
  projectId: "docnear-67873",
  storageBucket: "docnear-67873.firebasestorage.app",
  messagingSenderId: "749431360671",
  appId: "1:749431360671:web:669bea0e48fc589a7166aa",
  measurementId: "G-5XJEPRR650"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);