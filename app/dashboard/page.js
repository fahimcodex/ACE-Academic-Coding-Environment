"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LevelBar from "@/components/LevelBar";
import StreakWidget from "@/components/StreakWidget";
import BadgeGrid from "@/components/BadgeGrid";
import XpToast from "@/components/XpToast";
import Link from "next/link";
import {
  Zap,
  Flame,
  Trophy,
  BookOpen,
  ChevronRight,
  Target,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react";
import { todayString } from "@/lib/gamification";

const COURSES = [
  {
    id: "python",
    emoji: "🐍",
    name: "Python",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "hover:bg-green-500/5",
  },
  {
    id: "linux",
    emoji: "🐧",
    name: "Linux",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "hover:bg-orange-500/5",
  },
  {
    id: "c",
    emoji: "⚙️",
    name: "C",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "hover:bg-blue-500/5",
  },
  {
    id: "cpp",
    emoji: "🔷",
    name: "C++",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "hover:bg-purple-500/5",
  },
];

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [progress, setProgress] = useState([]);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [challengeDone, setChallengeDone] = useState(false);
  const [toastEvent, setToastEvent] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  // Load dashboard data
  useEffect(() => {
    if (!user) return;
    async function load() {
      // Completed lessons
      const q = query(
        collection(db, "progress"),
        where("userId", "==", user.uid),
      );
      const snap = await getDocs(q);
      setProgress(snap.docs.map((d) => d.data()));

      // Today's challenge
      const today = todayString();
      const chalSnap = await getDoc(doc(db, "challenges", today));
      if (chalSnap.exists())
        setTodayChallenge({ id: chalSnap.id, ...chalSnap.data() });

      // Check if challenge done today
      const doneSnap = await getDoc(
        doc(db, "challengeCompletions", `${user.uid}_${today}`),
      );
      setChallengeDone(doneSnap.exists());

      setDataLoading(false);
    }
    load();
  }, [user]);

  if (loading || !profile)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const completedLessons = progress.length;
  const totalXp = profile.xp ?? 0;
  const level = profile.level ?? 1;
  const streak = profile.streak ?? 0;
  const badges = profile.badges ?? [];

  // Group completed lessons by course
  const completedByCourse = {};
  COURSES.forEach((c) => {
    completedByCourse[c.id] = progress.filter(
      (p) => p.courseId === c.id,
    ).length;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <XpToast event={toastEvent} onDone={() => setToastEvent(null)} />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* ── Welcome header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back,{" "}
            <span className="text-blue-400">
              {profile.displayName?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-400 mt-1">
            Keep up your momentum — you&apos;re doing great!
          </p>
        </div>

        {/* ── Top stats row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Zap,
              color: "text-yellow-400 bg-yellow-400/10",
              label: "Total XP",
              value: totalXp.toLocaleString(),
            },
            {
              icon: TrendingUp,
              color: "text-blue-400   bg-blue-400/10",
              label: "Level",
              value: level,
            },
            {
              icon: Flame,
              color: "text-orange-400  bg-orange-400/10",
              label: "Day Streak",
              value: streak,
            },
            {
              icon: Star,
              color: "text-purple-400  bg-purple-400/10",
              label: "Badges",
              value: badges.length,
            },
          ].map(({ icon: Icon, color, label, value }) => (
            <div
              key={label}
              className="glass rounded-2xl p-5 border border-white/5"
            >
              <div
                className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Level bar + streak ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <LevelBar xp={totalXp} level={level} />
          <StreakWidget streak={streak} />
        </div>

        {/* ── Daily challenge card ───────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" /> Today&apos;s Challenge
          </h2>
          {todayChallenge ? (
            <Link
              href="/challenges"
              className={`glass rounded-2xl p-6 border flex items-center justify-between group transition-all card-hover block ${
                challengeDone
                  ? "border-green-500/30"
                  : "border-blue-500/20 hover:border-blue-500/40"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {challengeDone ? (
                    <span className="text-xs text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded-full">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      todayChallenge.difficulty === "Easy"
                        ? "text-green-400 bg-green-500/10"
                        : "text-yellow-400 bg-yellow-500/10"
                    }`}
                  >
                    {todayChallenge.difficulty}
                  </span>
                </div>
                <p className="font-bold text-lg">{todayChallenge.title}</p>
                <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                  {todayChallenge.description}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <p className="text-yellow-400 font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {todayChallenge.xpReward} XP
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ) : (
            <div className="glass rounded-2xl p-6 border border-white/5 text-gray-400 text-sm">
              No challenge today. Run{" "}
              <code className="text-blue-400">
                node scripts/seedChallenges.mjs
              </code>{" "}
              to add challenges.
            </div>
          )}
        </div>

        {/* ── Course progress ────────────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> Your Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COURSES.map((course) => {
              const done = completedByCourse[course.id] ?? 0;
              const total = 4; // approximate, update per course
              const pct = Math.min(Math.round((done / total) * 100), 100);
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className={`glass rounded-2xl p-5 border ${course.border} ${course.bg} group transition-all card-hover block`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{course.emoji}</span>
                    <span className={`text-xs font-bold ${course.color}`}>
                      {pct}%
                    </span>
                  </div>
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {done} lessons done
                  </p>
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${course.color.replace("text-", "bg-")} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">Continue</span>
                    <ChevronRight
                      className={`w-4 h-4 ${course.color} group-hover:translate-x-1 transition-transform`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Badges ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" /> Badges
              <span className="text-sm font-normal text-gray-400">
                ({badges.length} earned)
              </span>
            </h2>
            <Link
              href="/profile"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all →
            </Link>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/5">
            <BadgeGrid earnedBadges={badges} compact />
          </div>
        </div>

        {/* ── Recent activity ────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" /> Recent Activity
          </h2>
          <div className="glass rounded-2xl border border-white/5 divide-y divide-white/5">
            {dataLoading ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                Loading...
              </div>
            ) : progress.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                No lessons completed yet.{" "}
                <Link href="/courses" className="text-blue-400 hover:underline">
                  Start your first lesson!
                </Link>
              </div>
            ) : (
              [...progress]
                .sort(
                  (a, b) =>
                    (b.completedAt?.seconds ?? 0) -
                    (a.completedAt?.seconds ?? 0),
                )
                .slice(0, 5)
                .map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Lesson completed</p>
                        <p className="text-xs text-gray-400">
                          {item.courseId} · {item.lessonId}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> +{item.xpEarned} XP
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
