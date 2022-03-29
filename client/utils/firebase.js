// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAn9y2tT_hacMMY2uivM_KxWZVXfv24rdQ",
    authDomain: "yoriqulov-lms.firebaseapp.com",
    projectId: "yoriqulov-lms",
    storageBucket: "yoriqulov-lms.appspot.com",
    messagingSenderId: "9818064935",
    appId: "1:9818064935:web:84d36f823df81b9faee602",
    measurementId: "G-877XNFDVDL"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
export default firebaseApp