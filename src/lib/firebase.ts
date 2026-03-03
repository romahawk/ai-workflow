import { initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

export const isFirebaseEnabled = !!VITE_FIREBASE_PROJECT_ID;

let _db: Firestore | null = null;

if (isFirebaseEnabled) {
  const app = initializeApp({
    apiKey:            VITE_FIREBASE_API_KEY,
    authDomain:        VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         VITE_FIREBASE_PROJECT_ID,
    storageBucket:     VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             VITE_FIREBASE_APP_ID,
  });
  _db = getFirestore(app);
} else {
  console.info("[Firebase] env vars not set — using localStorage fallback.");
}

// Only access `db` inside `isFirebaseEnabled` branches
export const db = _db as Firestore;
