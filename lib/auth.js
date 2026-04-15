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
        await ensureProfileExists(firebaseUser);

        // Set up real-time listener for profile changes
        const ref = doc(db, "users", firebaseUser.uid);
        unsubscribeProfile = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
          }
        });
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

  // Ensure user profile exists in Firestore, create one on first sign-in
  async function ensureProfileExists(firebaseUser) {
    try {
      await ensureProfileExists(firebaseUser);
      const ref = doc(db, "users", firebaseUser.uid);
      unsubscribeProfile = onSnapshot(ref, (snap) => {
        if (snap.exists()) setProfile(snap.data());
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
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
