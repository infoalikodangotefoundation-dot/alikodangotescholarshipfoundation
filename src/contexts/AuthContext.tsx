import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  signUp: async () => {},
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
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error("Password is required for email login");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    const newProfile = {
      fullName,
      phoneNumber,
      email,
      role: email === 'info.alikodangotefoundation@gmail.com' ? 'admin' : 'applicant',
      createdAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, 'users', uid), newProfile);
    setUserProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, login, loginWithGoogle, signUp, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
