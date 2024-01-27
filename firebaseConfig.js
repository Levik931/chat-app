import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBS5MMHccqdoEoOgfPhNiEzKwQEhp-Cyn0",
  authDomain: "chatapp-ed0a7.firebaseapp.com",
  databaseURL: "https://chatapp-ed0a7-default-rtdb.firebaseio.com",
  projectId: "chatapp-ed0a7",
  storageBucket: "chatapp-ed0a7.appspot.com",
  messagingSenderId: "183951813596",
  appId: "1:183951813596:web:3aaf1e6d0c29274fe3bd19",
  measurementId: "G-XNNGRTLDB5",
};

// Initialize Firebase App
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);

// ios: 629450976243-c6edbh4am9mkmvuk04vn8b7v9l6irp2q.apps.googleusercontent.com
// android : 629450976243-riu097jmp17vumsn9sqprc7sd6cr6pr2.apps.googleusercontent.com
