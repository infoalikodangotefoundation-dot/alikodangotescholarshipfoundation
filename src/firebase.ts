import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import firebaseConfigFromFile from '../firebase-applet-config.json';

// Use environment variables if available, otherwise fallback to the config file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigFromFile.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigFromFile.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigFromFile.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigFromFile.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigFromFile.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigFromFile.appId,
};

const app = initializeApp(firebaseConfig);

// Handle (default) database ID correctly
const firestoreDbId = firebaseConfigFromFile.firestoreDatabaseId;
export const db = firestoreDbId && firestoreDbId !== '(default)' 
  ? getFirestore(app, firestoreDbId) 
  : getFirestore(app);

export const storage = getStorage(app);
export const auth = getAuth(app);

async function testConnection() {
  try {
    // Attempt to fetch a document to verify connection
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection test: Success");
  } catch (error: any) {
    // Log the full error for debugging
    console.error("Firebase connection test failed:", error);
    
    if (error.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    } else if (error.message?.includes('permission-denied')) {
      console.log("Firebase connection test: Connected (but permission denied, which is expected if 'test/connection' is private)");
    }
  }
}
testConnection();
