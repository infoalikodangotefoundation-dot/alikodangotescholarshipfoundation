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
  try {
    // Attempt to fetch a document to verify connection
    // We use a path that we've explicitly allowed in firestore.rules
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection test: Success");
  } catch (error: any) {
    const isPermissionError = error.message?.includes('permission-denied') || 
                             error.message?.includes('Missing or insufficient permissions');
    const isOfflineError = error.message?.includes('the client is offline');

    if (isPermissionError) {
      // If we get a permission error, it still means we connected to Firebase
      console.log("Firebase connection test: Connected (but permission denied, which is fine for a connection test)");
    } else if (isOfflineError) {
      console.error("Firebase connection test failed: The client is offline. Please check your Firebase configuration.");
    } else {
      console.error("Firebase connection test failed with unexpected error:", error);
    }
  }
}
testConnection();
