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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  const path = 'test/connection';
  try {
    // Attempt to fetch a document to verify connection
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection test: Success");
  } catch (error: any) {
    // Log the full error for debugging
    console.error("Firebase connection test failed:", error);
    
    if (error.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    } else if (error.message?.includes('permission-denied') || error.message?.includes('Missing or insufficient permissions')) {
      console.log("Firebase connection test: Connected (but permission denied, which is expected if 'test/connection' is private)");
      // We don't throw here to avoid crashing the app on startup if it's just a connection test
    }
  }
}
testConnection();
