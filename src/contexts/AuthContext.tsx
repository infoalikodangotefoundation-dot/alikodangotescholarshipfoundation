import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  providerData: any[];
}

interface UserProfile {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
  photoURL?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, newPass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  signUp: async () => {},
  resendVerificationEmail: async () => {},
  reloadUser: async () => {},
  updateProfile: async () => {},
  resetPassword: async () => {},
  confirmReset: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          emailVerified: firebaseUser.emailVerified,
          providerData: firebaseUser.providerData,
        };
        setCurrentUser(user);
        await fetchProfile(firebaseUser.uid, user);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const fetchProfile = async (uid: string, user: User) => {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        const newProfile = {
          fullName: user.displayName || '',
          email: user.email || '',
          role: user.email === 'info.alikodangotefoundation@gmail.com' ? 'admin' : 'applicant',
          createdAt: new Date().toISOString(),
        };
        await setDoc(docRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      if (error.message?.includes('permission-denied') || error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error("Password is required for email login");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential.user.emailVerified) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error("UNAUTHORIZED_DOMAIN");
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    const newProfile = {
      fullName,
      phoneNumber,
      email,
      role: email === 'info.alikodangotefoundation@gmail.com' ? 'admin' : 'applicant',
      createdAt: new Date().toISOString(),
    };
    
    try {
      await setDoc(doc(db, 'users', uid), newProfile);
      setUserProfile(newProfile);
    } catch (error: any) {
      if (error.message?.includes('permission-denied') || error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.CREATE, `users/${uid}`);
      }
      throw error;
    }
    
    // Sign out after sign up to force verification on next login
    await signOut(auth);
  };

  const resendVerificationEmail = async () => {
    // This is tricky because we might have signed them out.
    // If we want to resend, we might need them to be signed in.
    // Or we can use a separate flow. 
    // Usually, you can only send verification if the user is signed in.
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error("No user signed in to send verification email to.");
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const firebaseUser = auth.currentUser;
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        emailVerified: firebaseUser.emailVerified,
        providerData: firebaseUser.providerData,
      };
      setCurrentUser(user);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error("No user logged in");
    
    // Security check: Don't allow email updates for now as per requirements
    const { email, ...updateData } = data;
    if (email) {
      console.warn("Email updates are not permitted through updateProfile at this time.");
    }

    const docRef = doc(db, 'users', currentUser.uid);
    try {
      await setDoc(docRef, updateData, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...updateData } : updateData);
    } catch (error: any) {
      if (error.message?.includes('permission-denied') || error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin + '/reset-password',
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const confirmReset = async (code: string, newPass: string) => {
    await confirmPasswordReset(auth, code, newPass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, login, loginWithGoogle, signUp, resendVerificationEmail, reloadUser, updateProfile, resetPassword, confirmReset, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
