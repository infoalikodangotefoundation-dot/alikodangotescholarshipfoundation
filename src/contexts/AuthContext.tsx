import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut
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
  loginWithGoogle: () => Promise<void>;
  reloadUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  loginWithGoogle: async () => {},
  reloadUser: async () => {},
  updateProfile: async () => {},
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
    throw new Error("Password reset is not applicable as email/password login is disabled.");
  };

  const confirmReset = async (code: string, newPass: string) => {
    throw new Error("Password reset is not applicable as email/password login is disabled.");
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userProfile, 
      loading, 
      loginWithGoogle, 
      reloadUser, 
      updateProfile, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
