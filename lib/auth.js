"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
<<<<<<< HEAD
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
=======
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
>>>>>>> content-expansion
import { auth, db, googleProvider } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes AND real-time profile updates
  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
<<<<<<< HEAD
        unsubscribeProfile = await loadOrCreateProfile(firebaseUser);
=======
        
        // Real-time listener for XP and Profile changes
        const ref = doc(db, "users", firebaseUser.uid);
        unsubscribeProfile = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            // First-time user — create their profile
            const newProfile = {
              uid:         firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email:       firebaseUser.email,
              photoURL:    firebaseUser.photoURL,
              xp:          0,
              level:       1,
              streak:      0,
              badges:      [],
              premium:     false,
              createdAt:   serverTimestamp(),
              lastActive:  serverTimestamp(),
            };
            setDoc(ref, newProfile); // This will trigger the snapshot again automatically
          }
        });

>>>>>>> content-expansion
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

<<<<<<< HEAD
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

=======
  
>>>>>>> content-expansion
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
