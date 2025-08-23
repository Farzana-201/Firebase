// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDinfH-6sv_DJYyKpVWmCZcYnX-FqbJ54s",
  authDomain: "fire-base-29011.firebaseapp.com",
  projectId: "fire-base-29011",
  storageBucket: "fire-base-29011.firebasestorage.app",
  messagingSenderId: "416547117736",
  appId: "1:416547117736:web:ac214307ce662ba1c3409d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');