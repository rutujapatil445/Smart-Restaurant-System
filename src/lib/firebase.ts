import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "./env";

const firebaseConfig = getFirebaseConfig();

let app: any;
let auth: any;
let db: any;

const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Check for missing keys
const missingKeys = requiredKeys.filter(key => {
  const val = firebaseConfig[key.replace('VITE_FIREBASE_', '').toLowerCase() as keyof typeof firebaseConfig];
  return !val;
});

try {
  if (missingKeys.length === 0 && firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } else {
    // Provide dummy objects to prevent immediate crashes
    auth = { 
      onAuthStateChanged: (cb: any) => { 
        cb(null); 
        return () => {}; 
      },
      currentUser: null
    }; 
    db = {};
    
    // Silent in production/preview unless explicitly needed
    if (import.meta.env.DEV) {
      if (missingKeys.length > 0) {
        console.info(`Firebase is not fully configured (missing: ${missingKeys.join(', ')}). Authentication features will be disabled.`);
      } else if (!firebaseConfig.apiKey) {
        console.info("Firebase API Key is missing. Authentication features will be disabled.");
      } else if (firebaseConfig.apiKey.length <= 10) {
        console.info("Firebase API Key is too short. Authentication features will be disabled.");
      }
    }
  }
} catch (error: any) {
  console.error("Firebase initialization failed:", error);
  if (error.code === 'auth/invalid-api-key') {
    console.error("The provided Firebase API Key is invalid. Please check your settings.");
  }
  auth = { 
    onAuthStateChanged: (cb: any) => { 
      cb(null); 
      return () => {}; 
    },
    currentUser: null
  };
  db = {};
}

export { auth, db };
