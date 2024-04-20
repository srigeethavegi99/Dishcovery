// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import FirebaseStorage type
import { ref } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAenUAk3CND5YcjCjZCaWpWBXbYPhH9G4k",
    authDomain: "cis658hw.firebaseapp.com",
    databaseURL: "https://cis658hw-default-rtdb.firebaseio.com",
    projectId: "cis658hw",
    storageBucket: "cis658hw.appspot.com",
    messagingSenderId: "292541339476",
    appId: "1:292541339476:web:5c47651e77c6928b411ac1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage= getStorage(app); // Specify FirebaseStorage type
const auth=getAuth();
export { storage, ref, auth, app };
