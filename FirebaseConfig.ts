import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU1yVgK5PMP5UqLhrNeeqBUqbnj4LOGi8",
  authDomain: "financialtracker-ab313.firebaseapp.com",
  projectId: "financialtracker-ab313",
  storageBucket: "financialtracker-ab313.firebasestorage.app",
  messagingSenderId: "276300898099",
  appId: "1:276300898099:web:70b4aa56bcea0764dfe846"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
