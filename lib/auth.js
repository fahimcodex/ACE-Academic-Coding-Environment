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

    // Move the function inside the useEffect
    async function ensureProfileExists(firebaseUser) {
      try {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
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
      } catch (error) {
        console.error("Error creating/checking profile:", error);
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          setUser(firebaseUser);
          await ensureProfileExists(firebaseUser);

          // Set up real-time listener for profile changes
          const ref = doc(db, "users", firebaseUser.uid);
          unsubscribeProfile = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
              setProfile(snap.data());
            }
          });
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      } else {
        setUser(null);
        setProfile(null);
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

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
      value={{ user, profile, loading, signInWithGoogle, logout }}
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
