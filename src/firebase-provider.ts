// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7qZKmEr5nlkygozSEdGJ1RFqij6rxZ_A",
  authDomain: "video-64b08.firebaseapp.com",
  projectId: "video-64b08",
  storageBucket: "video-64b08.appspot.com",
  messagingSenderId: "904634815195",
  appId: "1:904634815195:web:d05b5f0ea5ae29baaf72fe",
  measurementId: "G-8FFGBCTQMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);