"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        unsubscribeProfile = await loadOrCreateProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
        if (unsubscribeProfile) unsubscribeProfile();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  // Load user profile from Firestore, or create one on first sign-in
  async function loadOrCreateProfile(firebaseUser) {
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // First-time user — create their profile document
      const newProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        xp: 0,
        level: 1,
        streak: 0,
        badges: [],
        premium: false,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      };
      await setDoc(ref, newProfile);
    }

    // Return a real-time listener so the UI updates instantly
    return onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    });
  }

  // Allow manual updates for optimistic UI
  function updateProfile(newProfileData) {
    setProfile((prev) => ({ ...prev, ...newProfileData }));
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this anywhere to access auth state
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
