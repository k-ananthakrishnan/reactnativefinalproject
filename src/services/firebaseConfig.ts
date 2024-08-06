import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaBenu-JKRjxoAZM8LVJzKrf8C5JY1Srw",
  authDomain: "reactnativeproject-3f42d.firebaseapp.com",
  projectId: "reactnativeproject-3f42d",
  storageBucket: "reactnativeproject-3f42d.appspot.com",
  messagingSenderId: "565445202263",
  appId: "1:565445202263:web:eb326b9eeef8bdc68bee12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, firebaseConfig };
