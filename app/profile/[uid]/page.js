"use client";

import { useEffect, useState } from "react";
import {
  doc, getDoc, getDocs, collection,
  query, where, setDoc, deleteDoc, onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LevelBar from "@/components/LevelBar";
import StreakWidget from "@/components/StreakWidget";
import BadgeGrid from "@/components/BadgeGrid";
import Image from "next/image";
import Link from "next/link";
import {
  UserPlus, UserMinus, Zap, BookOpen,
  Trophy, ExternalLink, Share2, Check,
} from "lucide-react";
import { levelTitle, levelColor } from "@/lib/gamification";

export default function ProfilePage() {
  const { uid }               = useParams();
  const { user }              = useAuth();
  const [profile,   setProfile]   = useState(null);
  const [progress,  setProgress]  = useState([]);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [copied,    setCopied]    = useState(false);

  const isOwnProfile = user?.uid === uid;

  // ── Load profile ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setProfile({ id: snap.id, ...snap.data() });

      // Completed lessons
      const progSnap = await getDocs(
        query(collection(db, "progress"), where("userId", "==", uid))
      );
      setProgress(progSnap.docs.map(d => d.data()));

      // Follower / following counts
      const [follSnap, followingSnap] = await Promise.all([
        getDocs(query(collection(db, "follows"), where("followingId", "==", uid))),
        getDocs(query(collection(db, "follows"), where("followerId",  "==", uid))),
      ]);
      setFollowerCount(follSnap.size);
      setFollowingCount(followingSnap.size);

      // Is current user following this profile?
      if (user && user.uid !== uid) {
        const followSnap = await getDoc(doc(db, "follows", `${user.uid}_${uid}`));
        setFollowing(followSnap.exists());
      }

      setLoading(false);
    }
    load();
  }, [uid, user]);

  // ── Follow / unfollow ──────────────────────────────────────────────────────
  async function toggleFollow() {
    if (!user) return;
    const followId = `${user.uid}_${uid}`;
    const ref      = doc(db, "follows", followId);
    if (following) {
      await deleteDoc(ref);
      setFollowing(false);
      setFollowerCount(c => c - 1);
    } else {
      await setDoc(ref, {
        followerId:  user.uid,
        followingId: uid,
        createdAt:   new Date().toISOString(),
      });
      setFollowing(true);
      setFollowerCount(c => c + 1);
    }
  }

  // ── Share profile ──────────────────────────────────────────────────────────
  function shareProfile() {
    const url = `${window.location.origin}/profile/${uid}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      User not found.
    </div>
  );

  const xp      = profile.xp    ?? 0;
  const level   = profile.level ?? 1;
  const streak  = profile.streak ?? 0;
  const badges  = profile.badges ?? [];

  // Group progress by course
  const courseProgress = {};
  progress.forEach(p => {
    courseProgress[p.courseId] = (courseProgress[p.courseId] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">

        {/* ── Profile header card ────────────────────────────────────────── */}
        <div className="glass rounded-3xl p-8 border border-white/10 mb-6 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-600/10 to-purple-600/5 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-blue-500/30 flex-shrink-0">
              {profile.photoURL ? (
                <Image src={profile.photoURL} alt="avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                  {profile.displayName?.[0] ?? "?"}
                </div>
              )}
            </div>

            {/* Name + stats */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{profile.displayName ?? "Anonymous"}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full bg-white/5 ${levelColor(level)}`}>
                      Level {level} · {levelTitle(level)}
                    </span>
                    {badges.length > 0 && (
                      <span className="text-sm text-gray-400">{badges.length} badges</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={shareProfile}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-2 glass rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                    {copied ? "Copied!" : "Share"}
                  </button>
                  {!isOwnProfile && user && (
                    <button onClick={toggleFollow}
                      className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                        following
                          ? "glass border border-white/10 text-gray-300 hover:text-red-400 hover:border-red-500/30"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
                      }`}>
                      {following
                        ? <><UserMinus className="w-4 h-4" /> Unfollow</>
                        : <><UserPlus  className="w-4 h-4" /> Follow</>}
                    </button>
                  )}
                  {isOwnProfile && (
                    <Link href="/dashboard"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-2 glass rounded-xl border border-white/10 transition-all">
                      <ExternalLink className="w-4 h-4" /> Dashboard
                    </Link>
                  )}
                </div>
              </div>

              {/* Follow counts + XP */}
              <div className="flex items-center gap-5 mt-4 flex-wrap">
                <div className="text-center">
                  <p className="font-bold text-lg">{followerCount}</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{followingCount}</p>
                  <p className="text-xs text-gray-400">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-yellow-400 flex items-center gap-1">
                    <Zap className="w-4 h-4" />{xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Total XP</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{progress.length}</p>
                  <p className="text-xs text-gray-400">Lessons Done</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-orange-400">{streak}</p>
                  <p className="text-xs text-gray-400">Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Level bar + streak ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LevelBar xp={xp} level={level} />
          <StreakWidget streak={streak} />
        </div>

        {/* ── Course progress ─────────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> Course Progress
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id:"python", emoji:"🐍", name:"Python",  total:4 },
              { id:"linux",  emoji:"🐧", name:"Linux",   total:3 },
              { id:"c",      emoji:"⚙️", name:"C",       total:3 },
              { id:"cpp",    emoji:"🔷", name:"C++",     total:3 },
            ].map(course => {
              const done = courseProgress[course.id] ?? 0;
              const pct  = Math.min(Math.round((done / course.total) * 100), 100);
              return (
                <div key={course.id} className="text-center">
                  <div className="text-3xl mb-1">{course.emoji}</div>
                  <p className="text-sm font-semibold">{course.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{done}/{course.total}</p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Badges ─────────────────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Badges
            <span className="text-sm font-normal text-gray-400">({badges.length} earned)</span>
          </h2>
          <BadgeGrid earnedBadges={badges} />
        </div>

      </div>
    </div>
  );
}
