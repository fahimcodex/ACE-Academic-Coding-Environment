"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import NotificationBell from "@/components/NotificationBell";
import {
  Code2,
  Menu,
  X,
  Zap,
  LogOut,
  User,
  LayoutDashboard,
  Trophy,
  Brain,
} from "lucide-react";

export default function Navbar() {
  const { user, profile, signInWithGoogle, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-blue-400">ACE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link
              href="/courses"
              className="hover:text-white transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/challenges"
              className="hover:text-white transition-colors"
            >
              Challenges
            </Link>
            <Link
              href="/leaderboard"
              className="hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/ai"
              className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-medium transition-colors"
            >
              <Brain className="w-3.5 h-3.5" /> AI Hub
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* XP badge */}
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400">
                    {(profile?.xp ?? 0).toLocaleString()} XP
                  </span>
                </div>

                {/* Notification bell */}
                <NotificationBell />

                {/* Avatar + dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="relative w-9 h-9 rounded-full ring-2 ring-blue-500/50 hover:ring-blue-400 transition-all overflow-hidden"
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                        {user.displayName?.[0] ?? "U"}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 glass rounded-xl shadow-xl border border-white/10 py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-semibold truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        href={`/profile/${user.uid}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        href="/leaderboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Trophy className="w-4 h-4" /> Leaderboard
                      </Link>
                      <Link
                        href="/ai"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-pink-400 hover:text-pink-300 hover:bg-white/5 transition-colors"
                      >
                        <Brain className="w-4 h-4" /> AI Hub
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 space-y-3">
          <Link
            href="/courses"
            className="block text-gray-300 hover:text-white py-1"
          >
            Courses
          </Link>
          <Link
            href="/challenges"
            className="block text-gray-300 hover:text-white py-1"
          >
            Challenges
          </Link>
          <Link
            href="/leaderboard"
            className="block text-gray-300 hover:text-white py-1"
          >
            Leaderboard
          </Link>
          <Link
            href="/ai"
            className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 py-1"
          >
            <Brain className="w-4 h-4" /> AI Hub
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block text-gray-300 hover:text-white py-1"
              >
                Dashboard
              </Link>
              <Link
                href={`/profile/${user.uid}`}
                className="block text-gray-300 hover:text-white py-1"
              >
                My Profile
              </Link>
              <button
                onClick={logout}
                className="block text-red-400 hover:text-red-300 py-1"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Sign in with Google
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
