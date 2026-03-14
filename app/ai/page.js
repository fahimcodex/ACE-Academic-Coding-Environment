"use client";

// app/ai/page.js — AI Hub: Learning Path + Practice Problem Generator

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getLearningPath, generatePractice } from "@/lib/aiClient";
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
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

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

function Select({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {label && <p className="text-xs text-gray-400 mb-1">{label}</p>}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 glass border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors w-full min-w-[130px]"
      >
        <span className="capitalize truncate">{value}</span>
        <ChevronDown className="w-3 h-3 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 glass rounded-lg border border-white/10 py-1 z-20 w-full min-w-[130px] max-h-48 overflow-y-auto">
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

export default function AiPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

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

  // Derive the active topic — reset automatically when language changes
  const practiceTopic =
    practiceTopicOverride &&
    TOPICS[practiceLang]?.includes(practiceTopicOverride)
      ? practiceTopicOverride
      : (TOPICS[practiceLang]?.[0] ?? "");

  // Redirect if not signed in
  useEffect(() => {
    if (user === null) router.push("/");
  }, [user, router]);

  // Load completed lessons
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
      // Extract starter code block from the markdown response
      const match = result.match(/```(?:\w+)?\n([\s\S]*?)```/);
      if (match) setPracticeCode(match[1].trim());
    } catch (err) {
      setPracticeError(err.message);
    }
    setPracticeLoading(false);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        {/* Page header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-4">
            <Brain className="w-7 h-7 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">AI Learning Hub</h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Get a personalized study plan and AI-generated practice problems —
            completely free.
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
          {/* ── Learning Path ─────────────────────────────────────────────── */}
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
                completed, and the topics you find difficult.
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
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating your
                    path...
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

          {/* ── Practice Problem Generator ───────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold">Practice Problem Generator</h2>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10">
              <p className="text-sm text-gray-400 mb-4">
                Generate a fresh coding problem targeted at exactly what you
                need to practice.
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
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating
                    problem...
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

                {/* Embedded editor for the generated problem */}
                {practiceCode && (
                  <div>
                    <div className="px-4 py-2 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
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
                    <div className="px-4 py-3 bg-white/[0.02] border-t border-white/10 text-center">
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
