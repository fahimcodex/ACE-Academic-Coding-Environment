"use client";

import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Zap, Flame, Trophy, BookOpen, ChevronRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-blue-400">{profile.displayName?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">Continue your learning journey.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Zap,     color: "text-yellow-400 bg-yellow-400/10", label: "Total XP",     value: profile.xp ?? 0 },
            { icon: Trophy,  color: "text-purple-400 bg-purple-400/10", label: "Level",         value: profile.level ?? 1 },
            { icon: Flame,   color: "text-orange-400 bg-orange-400/10", label: "Day Streak",    value: profile.streak ?? 0 },
            { icon: BookOpen,color: "text-blue-400 bg-blue-400/10",     label: "Badges Earned", value: profile.badges?.length ?? 0 },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="glass rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Course tiles */}
        <h2 className="text-xl font-bold mb-4">Start a Track</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { emoji: "🐧", name: "Linux",  color: "border-orange-500/30 hover:border-orange-400/60", slug: "linux"  },
            { emoji: "⚙️", name: "C",      color: "border-blue-500/30   hover:border-blue-400/60",   slug: "c"      },
            { emoji: "🔷", name: "C++",    color: "border-purple-500/30 hover:border-purple-400/60", slug: "cpp"    },
            { emoji: "🐍", name: "Python", color: "border-green-500/30  hover:border-green-400/60",  slug: "python" },
          ].map(lang => (
            <Link key={lang.name} href={`/courses/${lang.slug}`}
              className={`glass rounded-2xl p-6 border ${lang.color} transition-all group flex flex-col items-start gap-3`}>
              <span className="text-3xl">{lang.emoji}</span>
              <p className="font-semibold text-lg">{lang.name}</p>
              <span className="mt-auto flex items-center gap-1 text-sm text-blue-400 group-hover:gap-2 transition-all">
                Open track <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* Coming soon note */}
        <div className="mt-10 glass rounded-2xl p-6 border border-white/5 flex items-center gap-4">
          <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <p className="text-gray-400 text-sm">
            Full dashboard features — lesson progress tracking, leaderboard, and AI tools — are coming in the next build session. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
