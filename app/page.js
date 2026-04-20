"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import {
  Code2,
  Terminal,
  Cpu,
  Zap,
  Trophy,
  Users,
  Star,
  BookOpen,
  ChevronRight,
  Flame,
  Shield,
  Brain,
  ArrowRight,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const LANGUAGES = [
  {
    icon: "🐧",
    name: "Linux",
    slug: "linux",
    color: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-500/30",
    tag: "text-orange-400",
    desc: "Master the command line, file system, permissions, and shell scripting in a simulated terminal.",
    lessons: 42,
    level: "Beginner",
  },
  {
    icon: "⚙️",
    name: "C",
    slug: "c",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/30",
    tag: "text-blue-400",
    desc: "Understand memory, pointers, and systems programming — the foundation of modern computing.",
    lessons: 58,
    level: "Intermediate",
  },
  {
    icon: "🔷",
    name: "C++",
    slug: "cpp",
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/30",
    tag: "text-purple-400",
    desc: "Object-oriented programming, templates, STL, and high-performance application development.",
    lessons: 64,
    level: "Intermediate",
  },
  {
    icon: "🐍",
    name: "Python",
    slug: "python",
    color: "from-green-500/20 to-green-600/5",
    border: "border-green-500/30",
    tag: "text-green-400",
    desc: "From basic scripting to advanced data structures, algorithms, and automation projects.",
    lessons: 76,
    level: "Beginner",
  },
];

const FEATURES = [
  {
    icon: Code2,
    color: "bg-blue-500/10 text-blue-400",
    title: "Run Code in the Browser",
    desc: "No installs, no setup. Write and execute Python, C, C++, and Bash right in your browser using Pyodide and Judge0.",
  },
  {
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-400",
    title: "XP, Levels & Badges",
    desc: "Earn experience points for every lesson, quiz, and challenge. Level up and collect badges to showcase on your profile.",
  },
  {
    icon: Flame,
    color: "bg-orange-500/10 text-orange-400",
    title: "Daily Streaks & Challenges",
    desc: "Build a learning habit with daily streak tracking and fresh coding challenges every 24 hours.",
  },
  {
    icon: Trophy,
    color: "bg-purple-500/10 text-purple-400",
    title: "Global Leaderboards",
    desc: "Compete with learners worldwide. Climb weekly rankings by language, course, or friend group.",
  },
  {
    icon: Brain,
    color: "bg-pink-500/10 text-pink-400",
    title: "AI-Powered Assistance",
    desc: "Get code explanations, debugging help, and a personalised learning path powered by Claude AI.",
  },
  {
    icon: Users,
    color: "bg-teal-500/10 text-teal-400",
    title: "Community & Comments",
    desc: "Ask questions, share solutions, and upvote helpful comments in the discussion section of every lesson.",
  },
];

const STATS = [
  { value: "240+", label: "Lessons" },
  { value: "4", label: "Languages" },
  { value: "50K+", label: "Learners" },
  { value: "Free", label: "Core Platform" },
];

const TESTIMONIALS = [
  {
    name: "Aisha R.",
    role: "CS Student",
    text: "I went from zero to writing my own C programs in 4 weeks. The streak system kept me coming back every day.",
    avatar: "A",
  },
  {
    name: "Marcus T.",
    role: "Self-taught Dev",
    text: "Finally a platform that teaches Linux properly. The simulated terminal is genius — no more breaking my own machine!",
    avatar: "M",
  },
  {
    name: "Priya K.",
    role: "Bootcamp Graduate",
    text: "The AI debugging assistant is a game changer. It explains not just what's wrong but WHY — better than Stack Overflow.",
    avatar: "P",
  },
];

// ── Components ────────────────────────────────────────────────────────────────

// function StatCard({ value, label }) {
//   return (
//     <div className="text-center">
//       <div className="text-4xl font-bold gradient-text mb-1">{value}</div>
//       <div className="text-gray-400 text-sm">{label}</div>
//     </div>
//   );
// }

function LanguageCard({ lang }) {
  return (
    <div
      className={`glass rounded-2xl p-6 border ${lang.border} bg-linear-to-br ${lang.color} card-hover group`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{lang.icon}</span>
        <span
          className={`text-xs font-semibold ${lang.tag} bg-white/5 px-2 py-1 rounded-full`}
        >
          {lang.level}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{lang.name}</h3>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{lang.desc}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{lang.lessons} lessons</span>
        <Link
          href={`/courses/${lang.slug}`}
          className={`flex items-center gap-1 text-sm font-semibold ${lang.tag} group-hover:gap-2 transition-all`}
        >
          Start <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ feature }) {
  const Icon = feature.icon;
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div
        className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold mb-2">{feature.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
    </div>
  );
}

// function TestimonialCard({ t }) {
//   return (
//     <div className="glass rounded-2xl p-6 card-hover">
//       <div className="flex gap-1 mb-3">
//         {[...Array(5)].map((_, i) => (
//           <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//         ))}
//       </div>
//       <p className="text-gray-300 text-sm leading-relaxed mb-4">
//         &quot;{t.text}&quot;
//       </p>
//       <div className="flex items-center gap-3">
//         <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
//           {t.avatar}
//         </div>
//         <div>
//           <p className="text-sm font-semibold">{t.name}</p>
//           <p className="text-xs text-gray-400">{t.role}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-75 h-75 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-blue-300 border border-blue-500/20 mb-8">
            <Zap className="w-4 h-4 text-yellow-400" />
            Gamified coding education
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Learn to code
            <span className="block gradient-text">the right way.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Master{" "}
            <strong className="text-white">Linux, C, C++, and Python</strong>{" "}
            through interactive lessons, real-time code execution, daily
            challenges, and an AI-powered learning path — all in your browser,
            no setup required.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
              >
                Go to Dashboard <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                Get started free
              </button>
            )}
            <Link
              href="/courses"
              className="flex items-center gap-2 text-gray-300 hover:text-white font-semibold px-6 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all"
            >
              <BookOpen className="w-5 h-5" /> Browse Courses
            </Link>
          </div>

          {/* Trust line 
          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Free forever • All AI features included
          </p>
          */}
        </div>
      </section>

      {/* ── Stats ── */}
      {/* <section className="py-12 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Language Tracks ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              Four languages. One platform.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Structured learning paths from your first command to advanced
              systems programming.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LANGUAGES.map((lang) => (
              <LanguageCard key={lang.name} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to learn faster.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              ACE combines structured curriculum, real-time practice, and social
              motivation in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">How ACE works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: BookOpen,
                color: "text-blue-400",
                title: "Pick a course",
                desc: "Choose your language and skill level. Our curriculum takes you from zero to confident, step by step.",
              },
              {
                step: "02",
                icon: Terminal,
                color: "text-green-400",
                title: "Code in the browser",
                desc: "Write and run real code instantly. Python runs via WebAssembly; C and C++ via the Judge0 cloud compiler.",
              },
              {
                step: "03",
                icon: Trophy,
                color: "text-yellow-400",
                title: "Level up & compete",
                desc: "Earn XP, unlock badges, maintain streaks, and climb the global leaderboard as you progress.",
              },
            ].map(({ step, icon: Icon, color, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto">
                    <Icon className={`w-7 h-7 ${color}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full text-xs font-bold flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {/* <section className="py-24 px-4 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Learners love ACE</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Final CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-purple-600/5 pointer-events-none" />
            <div className="relative">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">
                Start your coding journey today.
              </h2>
              <p className="text-gray-400 mb-8">
                Join thousands of learners building real skills. Free forever.
                All features including AI assistance are completely free.
              </p>
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
                >
                  Go to Dashboard <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  Sign in with Google — it&apos;s free
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <span className="font-bold">
              <span className="text-blue-400">ACE</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 ACE — Academic Coding Environment. Built with Next.js &
            Firebase.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-300">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
