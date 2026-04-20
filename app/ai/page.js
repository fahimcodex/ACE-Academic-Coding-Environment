"use client";

// app/ai/page.js
// Guests see a full feature showcase page
// Signed-in users see the full AI Hub

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { getLearningPath, generatePractice } from "@/lib/aiClient";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Brain,
  Map,
  Zap,
  Loader2,
  RefreshCw,
  Code2,
  ChevronDown,
  Sparkles,
  Bug,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

// ── Data ──────────────────────────────────────────────────────────────────────

const LANGUAGES = ["python", "c", "cpp", "linux"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TOPICS = {
  python: [
    "Variables & Types",
    "Loops",
    "Functions",
    "Lists",
    "Strings",
    "Dictionaries",
    "Recursion",
    "File I/O",
  ],
  c: [
    "Variables",
    "Pointers",
    "Arrays",
    "Functions",
    "Structs",
    "Memory Management",
    "File I/O",
  ],
  cpp: [
    "Classes",
    "Inheritance",
    "Templates",
    "STL",
    "Pointers",
    "Vectors",
    "Strings",
  ],
  linux: [
    "Navigation",
    "File Management",
    "Permissions",
    "Grep & Search",
    "Pipes",
    "Shell Scripts",
  ],
};

const FEATURES = [
  {
    icon: Brain,
    color: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    glow: "group-hover:shadow-pink-500/10",
    title: "Code Explanation",
    desc: "Highlight any piece of code and get a clear, plain-English breakdown — line by line. Choose your experience level (beginner, intermediate, or advanced) and the AI adapts its explanation to match.",
    example:
      'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))',
    output:
      "This function takes a name as input and returns a personalized greeting. The f-string on line 2 inserts the name variable directly into the string...",
  },
  {
    icon: Bug,
    color: "bg-red-500/10 border-red-500/20 text-red-400",
    glow: "group-hover:shadow-red-500/10",
    title: "Debugging Assistant",
    desc: "Paste your buggy code and error message. The AI identifies the root cause, explains why it happened in plain language, and gives you a corrected version — so you actually learn from the mistake.",
    example: "nums = [1, 2, 3]\nprint(nums[5])",
    output:
      "🐛 Bug Found: IndexError — accessing an index that doesn't exist.\n📍 Location: Line 2\n💡 Why: The list has 3 elements (indices 0–2) but you're accessing index 5...",
  },
  {
    icon: Map,
    color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    glow: "group-hover:shadow-blue-500/10",
    title: "Personalized Learning Path",
    desc: "Tell the AI which topics you find difficult and it analyses your completed lessons, XP, and level to generate a custom weekly study plan — prioritising exactly what you need to improve.",
    example: "XP: 320 | Level: 4 | Struggling with: recursion, pointers",
    output:
      "Based on your progress, focus this week on: 1) Recursion fundamentals (revisit lesson 21), 2) Practice pointer exercises in C, 3) Try 2 medium challenges daily...",
  },
  {
    icon: Zap,
    color: "bg-green-500/10 border-green-500/20 text-green-400",
    glow: "group-hover:shadow-green-500/10",
    title: "Practice Problem Generator",
    desc: "Choose a language, topic, and difficulty — and the AI generates a brand-new coding problem you haven't seen before, complete with a description, example input/output, starter code, and a hint.",
    example: "Language: Python | Topic: Recursion | Difficulty: Medium",
    output:
      "Problem: Tower of Hanoi\nWrite a recursive function that prints the steps to move n disks from rod A to rod C using rod B as helper...",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Sign in with Google",
    desc: "One click — no password, no form, no credit card. Your account is created instantly.",
  },
  {
    step: "02",
    title: "Complete lessons & earn XP",
    desc: "Work through structured Python, C, C++, and Linux courses. The AI learns your pace and weak spots.",
  },
  {
    step: "03",
    title: "Open the AI Hub anytime",
    desc: "Use Code Explanation while studying, Debug Assistant when stuck, and Learning Path to plan your week.",
  },
];

// ── Reusable Select component ─────────────────────────────────────────────────

function Select({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {label && <p className="text-xs text-gray-400 mb-1">{label}</p>}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 glass border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors w-full min-w-32.5"
      >
        <span className="capitalize truncate">{value}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 glass rounded-lg border border-white/10 py-1 z-20 w-full min-w-32.5 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm capitalize transition-colors hover:bg-white/5 ${
                value === opt ? "text-blue-400" : "text-gray-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Guest showcase page ───────────────────────────────────────────────────────

function GuestAiPage({ signInWithGoogle }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 bg-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/3 w-75 h-75 bg-blue-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass border border-pink-500/20 px-4 py-2 rounded-full text-sm text-pink-300 mb-8">
            <Brain className="w-4 h-4 text-pink-400" />
            Powered by Groq AI — completely free
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Meet Your
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 to-pink-600">
              AI Learning Assistant
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ACE&apos;s AI Hub gives every learner a personal coding tutor —
            explaining code, fixing bugs, planning your study week, and
            generating fresh practice problems. All free, all in your browser.
          </p>

          {/* CTA */}
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
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

          <p className="mt-4 text-sm text-gray-500">
            No credit card · No setup · Sign in takes 5 seconds
          </p>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">
              Four AI tools. One platform.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Every feature is designed to make you a better coder — not just
              give you answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`group glass rounded-2xl border ${f.color.split(" ")[1]} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${f.glow}`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color.split(" ")[0]}`}
                    >
                      <Icon className={`w-5 h-5 ${f.color.split(" ")[2]}`} />
                    </div>
                    <h3 className="font-bold text-lg">{f.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    {f.desc}
                  </p>

                  {/* Example preview */}
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    {/* Input */}
                    <div className="bg-gray-900 px-4 py-3 border-b border-white/10">
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                        Example Input
                      </p>
                      <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {f.example}
                      </pre>
                    </div>
                    {/* Output */}
                    <div className="bg-gray-950 px-4 py-3">
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                        AI Response
                      </p>
                      <p className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed line-clamp-3">
                        {f.output}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How it works</h2>
            <p className="text-gray-400">Up and running in under a minute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-xl font-extrabold text-blue-400">
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

      {/* ── What's included ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Everything is free</h2>
            <p className="text-gray-400">
              No tiers, no hidden limits. Every feature is available to every
              learner.
            </p>
          </div>

          <div className="glass rounded-2xl border border-white/10 divide-y divide-white/5">
            {[
              "All 30 Python lessons + C, C++, and Linux tracks",
              "Browser-based code execution — Python, C, C++, Linux terminal",
              "Interactive quizzes with instant feedback",
              "XP, levels, badges, streaks, and daily challenges",
              "Global leaderboard and public profiles",
              "AI Code Explanation for every lesson",
              "AI Debugging Assistant — paste any error",
              "Personalized weekly Learning Path",
              "Unlimited Practice Problem generation",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 px-6 py-4">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <p className="text-gray-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-pink-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-pink-600/5 to-blue-600/5 pointer-events-none" />
            <div className="relative">
              <Brain className="w-12 h-12 text-pink-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Your AI tutor is waiting.
              </h2>
              <p className="text-gray-400 mb-8">
                Join learners who are studying smarter with AI-powered
                explanations, debugging help, and personalised study plans — all
                completely free.
              </p>
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
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
              <p className="mt-4 text-sm text-gray-500">
                Sign in with Google · Takes 5 seconds
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Signed-in AI Hub ──────────────────────────────────────────────────────────

function SignedInAiPage({ user, profile }) {
  const [completedIds, setCompletedIds] = useState([]);
  const [weakAreas, setWeakAreas] = useState("");
  const [pathResult, setPathResult] = useState("");
  const [pathLoading, setPathLoading] = useState(false);
  const [pathError, setPathError] = useState("");
  const [practiceLang, setPracticeLang] = useState("python");
  const [practiceTopicOverride, setPracticeTopicOverride] = useState("");
  const [practiceDiff, setPracticeDiff] = useState("Easy");
  const [practiceResult, setPracticeResult] = useState("");
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceError, setPracticeError] = useState("");
  const [practiceCode, setPracticeCode] = useState("");

  const practiceTopic =
    practiceTopicOverride &&
    TOPICS[practiceLang]?.includes(practiceTopicOverride)
      ? practiceTopicOverride
      : (TOPICS[practiceLang]?.[0] ?? "");

  useEffect(() => {
    if (!user) return;
    async function load() {
      const snap = await getDocs(
        query(collection(db, "progress"), where("userId", "==", user.uid)),
      );
      setCompletedIds(snap.docs.map((d) => d.data().lessonId));
    }
    load();
  }, [user]);

  async function getPath() {
    if (!user) return;
    setPathLoading(true);
    setPathError("");
    setPathResult("");
    try {
      const areas = weakAreas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const result = await getLearningPath(
        completedIds,
        profile?.xp ?? 0,
        profile?.level ?? 1,
        areas,
        user.uid,
      );
      setPathResult(result);
    } catch (err) {
      setPathError(err.message);
    }
    setPathLoading(false);
  }

  async function getPractice() {
    if (!user) return;
    setPracticeLoading(true);
    setPracticeError("");
    setPracticeResult("");
    setPracticeCode("");
    try {
      const result = await generatePractice(
        practiceTopic,
        practiceLang,
        practiceDiff,
        completedIds,
        user.uid,
      );
      setPracticeResult(result);
      const match = result.match(/```(?:\w+)?\n([\s\S]*?)```/);
      if (match) setPracticeCode(match[1].trim());
    } catch (err) {
      setPracticeError(err.message);
    }
    setPracticeLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-4">
            <Brain className="w-7 h-7 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">AI Learning Hub</h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Your personal AI tutor — personalized study plans and fresh practice
            problems.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-gray-500">Powered by</span>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              Groq Llama 3.1
            </span>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full font-semibold">
              Free
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Path */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Personalized Learning Path</h2>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10">
              <p className="text-sm text-gray-400 mb-4">
                Based on your{" "}
                <span className="text-yellow-400 font-semibold">
                  {profile?.xp ?? 0} XP
                </span>
                ,{" "}
                <span className="text-blue-400 font-semibold">
                  {completedIds.length} lessons
                </span>{" "}
                completed.
              </p>
              <div className="mb-4">
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Topics you find difficult (comma separated, optional):
                </label>
                <input
                  value={weakAreas}
                  onChange={(e) => setWeakAreas(e.target.value)}
                  placeholder="e.g. pointers, recursion, loops"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40"
                />
              </div>
              <button
                onClick={getPath}
                disabled={pathLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {pathLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate My Learning Path
                  </>
                )}
              </button>
            </div>
            {pathError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm whitespace-pre-wrap">
                  ❌ {pathError}
                </p>
              </div>
            )}
            {pathResult && (
              <div className="glass rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-blue-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Your Learning Path
                  </p>
                  <button
                    onClick={getPath}
                    disabled={pathLoading}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {pathResult}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Practice Generator */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold">Practice Problem Generator</h2>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10">
              <p className="text-sm text-gray-400 mb-4">
                Generate a fresh problem targeted at what you need to practice.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Select
                  value={practiceLang}
                  onChange={(v) => {
                    setPracticeLang(v);
                    setPracticeTopicOverride("");
                  }}
                  options={LANGUAGES}
                  label="Language"
                />
                <Select
                  value={practiceDiff}
                  onChange={setPracticeDiff}
                  options={DIFFICULTIES}
                  label="Difficulty"
                />
                <Select
                  value={practiceTopic}
                  onChange={setPracticeTopicOverride}
                  options={TOPICS[practiceLang] ?? []}
                  label="Topic"
                />
              </div>
              <button
                onClick={getPractice}
                disabled={practiceLoading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {practiceLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Generate Practice Problem
                  </>
                )}
              </button>
            </div>
            {practiceError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm whitespace-pre-wrap">
                  ❌ {practiceError}
                </p>
              </div>
            )}
            {practiceResult && (
              <div className="glass rounded-2xl border border-green-500/20 overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-green-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Your Challenge
                    </p>
                    <button
                      onClick={getPractice}
                      disabled={practiceLoading}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> New problem
                    </button>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {practiceResult}
                    </ReactMarkdown>
                  </div>
                </div>
                {practiceCode && (
                  <div>
                    <div className="px-4 py-2 bg-white/2 border-b border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-mono">
                        {practiceLang === "cpp"
                          ? "solution.cpp"
                          : practiceLang === "c"
                            ? "solution.c"
                            : "solution.py"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Edit your solution here
                      </span>
                    </div>
                    <MonacoEditor
                      height="220px"
                      language={
                        practiceLang === "cpp"
                          ? "cpp"
                          : practiceLang === "c"
                            ? "c"
                            : "python"
                      }
                      theme="vs-dark"
                      value={practiceCode}
                      onChange={(v) => setPracticeCode(v ?? "")}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        padding: { top: 10 },
                      }}
                    />
                    <div className="px-4 py-3 bg-white/2 border-t border-white/10 text-center">
                      <p className="text-xs text-gray-500">
                        To run your code, paste it into a{" "}
                        <Link
                          href="/courses/python"
                          className="text-blue-400 hover:underline"
                        >
                          lesson editor
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main export — switches between guest and signed-in view ───────────────────

export default function AiPage() {
  const { user, profile, signInWithGoogle } = useAuth();

  // Show guest page while auth is loading or user is not signed in
  if (!user) return <GuestAiPage signInWithGoogle={signInWithGoogle} />;

  return <SignedInAiPage user={user} profile={profile} />;
}
