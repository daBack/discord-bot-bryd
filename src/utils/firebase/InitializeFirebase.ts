import dotenv from 'dotenv';
dotenv.config();
import { initializeApp } from 'firebase/app';

const initializeFirebase = () => {
  // Set the configuration for your app
  // TODO: Replace with your app's config object
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.FIREBASE_STORAGE_URL,
  };
  return initializeApp(firebaseConfig);
};

export default initializeFirebase;
