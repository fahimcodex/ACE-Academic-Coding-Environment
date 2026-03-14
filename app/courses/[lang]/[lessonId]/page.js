"use client";

// app/courses/[lang]/[lessonId]/page.js
//
// Full lesson page: Theory → Code Editor (with execution) → Quiz
// Execution engines:
//   Python → Pyodide (WebAssembly, runs in browser)
//   C/C++  → Judge0 API (cloud compilation)
//   Linux  → LinuxTerminal component (simulated in browser)

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import LinuxTerminal from "@/components/LinuxTerminal";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Zap,
  CheckCircle,
  XCircle,
  ChevronRight,
  Clock,
  Terminal,
  Code2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Load Monaco only on client (it uses browser APIs)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

// ── Execution helpers (imported lazily to keep bundle small) ──────────────────

async function executePython(code, onStatus) {
  const { runPython } = await import("@/lib/executors/python");
  return runPython(code, onStatus);
}

async function executeC(code, lang) {
  const { runWithJudge0 } = await import("@/lib/executors/judge0");
  return runWithJudge0(code, lang);
}

// ── Monaco language map ───────────────────────────────────────────────────────
const MONACO_LANG = { python: "python", c: "c", cpp: "cpp", linux: "shell" };
const FILE_NAME = {
  python: "main.py",
  c: "main.c",
  cpp: "main.cpp",
  linux: "script.sh",
};

// ─────────────────────────────────────────────────────────────────────────────

export default function LessonPage() {
  const { lang, lessonId } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();

  // ── Data ──────────────────────────────────────────────────────────────────
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Editor ────────────────────────────────────────────────────────────────
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [execMeta, setExecMeta] = useState(null); // { time, memory, status }

  // ── Navigation ────────────────────────────────────────────────────────────
  const [tab, setTab] = useState("theory"); // "theory" | "code" | "quiz"

  // ── Quiz ──────────────────────────────────────────────────────────────────
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  // ── Load lesson from Firestore ─────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "courses", lang, "lessons", lessonId));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setLesson(data);
        setCode(data.starterCode ?? "");
        // Auto-set output hint for Python
        if (data.language === "python") {
          setOutput(
            "⏳ Python runtime will load when you click Run (first time ~5s).",
          );
        } else if (data.language === "linux") {
          setOutput("");
        } else {
          setOutput("Click ▶ Run to compile and execute your code.");
        }
      }
      setLoading(false);
    }
    load();
  }, [lang, lessonId]);

  // ── Run code ───────────────────────────────────────────────────────────────
  const runCode = useCallback(async () => {
    if (!lesson || running) return;
    setRunning(true);
    setExecMeta(null);

    try {
      if (lesson.language === "python") {
        setOutput("Running Python...");
        const { output: out, error } = await executePython(code, (msg) =>
          setOutput(msg),
        );
        if (error) setOutput(`❌ Error:\n${error}`);
        else setOutput(out || "(no output)");
      } else if (lesson.language === "c" || lesson.language === "cpp") {
        setOutput("⏳ Compiling and running...");
        const result = await executeC(code, lesson.language);
        if (result.error) {
          setOutput(result.error);
        } else {
          setOutput(result.output || "(no output)");
          if (result.time)
            setExecMeta({
              time: result.time,
              memory: result.memory,
              status: result.status,
            });
        }
      } else {
        setOutput("Use the Terminal tab for Linux command practice.");
      }
    } catch (err) {
      setOutput("❌ Unexpected error: " + err.message);
    }

    setRunning(false);
  }, [lesson, code, running]);

  // ── Keyboard shortcut: Ctrl+Enter to run ───────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runCode]);

  // ── Submit quiz ────────────────────────────────────────────────────────────
  async function submitQuiz() {
    setSubmitted(true);
    const allCorrect = lesson.quiz.every((q, i) => answers[i] === q.correct);

    if (allCorrect && !xpEarned && user) {
      try {
        const newXp = (profile?.xp ?? 0) + lesson.xpReward;
        const newLevel = Math.floor(newXp / 200) + 1;

        // Update user XP
        await setDoc(
          doc(db, "users", user.uid),
          { xp: newXp, level: newLevel, lastActive: serverTimestamp() },
          { merge: true },
        );
        // Record lesson completion
        await setDoc(doc(db, "progress", `${user.uid}_${lesson.id}`), {
          userId: user.uid,
          lessonId: lesson.id,
          courseId: lang,
          xpEarned: lesson.xpReward,
          completedAt: serverTimestamp(),
        });
        setXpEarned(true);
      } catch (err) {
        console.error("XP update failed:", err);
      }
    }
  }

  // ── Loading / not found ────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!lesson)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Lesson not found.
      </div>
    );

  const quizScore = submitted
    ? lesson.quiz.filter((q, i) => answers[i] === q.correct).length
    : 0;

  const isLinux = lesson.language === "linux";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="pt-16 border-b border-white/5 bg-gray-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link
            href={`/courses/${lang}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to course</span>
          </Link>

          <h1 className="text-sm font-semibold text-gray-200 truncate max-w-xs sm:max-w-none">
            {lesson.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {lesson.duration}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                {lesson.xpReward} XP
              </span>
            </span>
          </div>
        </div>

        {/* Tab nav */}
        <div className="max-w-7xl mx-auto px-4 flex gap-0">
          {[
            { id: "theory", label: "📖 Theory", icon: BookOpen },
            {
              id: "code",
              label: isLinux ? "🖥️ Terminal" : "💻 Code",
              icon: isLinux ? Terminal : Code2,
            },
            { id: "quiz", label: "🧠 Quiz", icon: CheckCircle },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                tab === t.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* ── THEORY ────────────────────────────────────────────────────── */}
        {tab === "theory" && (
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-invert prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10 prose-code:text-blue-300 prose-headings:text-white prose-a:text-blue-400 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.theory}
              </ReactMarkdown>
            </article>
            <div className="mt-10 flex gap-3">
              <button
                onClick={() => setTab("code")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                {isLinux ? "Open Terminal" : "Open Code Editor"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── CODE / TERMINAL ───────────────────────────────────────────── */}
        {tab === "code" && (
          <div className="flex flex-col gap-4">
            {/* Linux: show terminal */}
            {isLinux && (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Practice Linux commands in the simulated terminal below. Type{" "}
                  <code className="text-blue-400">help</code> to see all
                  available commands.
                </p>
                <LinuxTerminal />
              </div>
            )}

            {/* Python / C / C++: show Monaco editor + output */}
            {!isLinux && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Editor panel */}
                <div className="glass rounded-xl overflow-hidden border border-white/10">
                  {/* Editor toolbar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">
                      {FILE_NAME[lesson.language] ?? "code"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 hidden sm:block">
                        Ctrl+Enter to run
                      </span>
                      <button
                        onClick={() => setCode(lesson.starterCode)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded transition-colors hover:bg-white/5"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                      <button
                        onClick={runCode}
                        disabled={running}
                        className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded font-semibold transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        {running ? "Running..." : "Run"}
                      </button>
                    </div>
                  </div>

                  <MonacoEditor
                    height="420px"
                    language={MONACO_LANG[lesson.language] ?? "plaintext"}
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v ?? "")}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 12, bottom: 12 },
                      lineNumbers: "on",
                      renderLineHighlight: "line",
                      tabSize: lesson.language === "python" ? 4 : 2,
                      wordWrap: "on",
                    }}
                  />
                </div>

                {/* Output panel */}
                <div className="glass rounded-xl overflow-hidden border border-white/10">
                  <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/10">
                    <span className="text-xs text-gray-400">Output</span>
                    {execMeta && (
                      <span className="text-xs text-gray-500">
                        {execMeta.time}s ·{" "}
                        {Math.round((execMeta.memory ?? 0) / 1024)}KB
                      </span>
                    )}
                  </div>
                  <pre
                    className={`p-4 text-sm font-mono whitespace-pre-wrap overflow-auto h-[420px] ${
                      output.startsWith("❌")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {output || "Click ▶ Run to execute your code."}
                  </pre>
                </div>
              </div>
            )}

            {/* Next step button */}
            <div className="flex justify-end">
              <button
                onClick={() => setTab("quiz")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Take the Quiz <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── QUIZ ──────────────────────────────────────────────────────── */}
        {tab === "quiz" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Quick Quiz</h2>
              <span className="text-sm text-gray-400">
                {lesson.quiz.length} questions
              </span>
            </div>
            <p className="text-gray-400 mb-8">
              Answer all questions correctly to earn{" "}
              <span className="text-yellow-400 font-semibold">
                +{lesson.xpReward} XP
              </span>
              .
            </p>

            {/* XP earned banner */}
            {xpEarned && (
              <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-4 mb-6 animate-pulse">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-yellow-300 font-bold">
                    +{lesson.xpReward} XP earned!
                  </p>
                  <p className="text-yellow-400/70 text-sm">
                    Your progress has been saved.
                  </p>
                </div>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-6">
              {lesson.quiz.map((q, qi) => (
                <div
                  key={q.id}
                  className="glass rounded-xl p-6 border border-white/10"
                >
                  <p className="font-semibold mb-4 leading-relaxed">
                    <span className="text-blue-400 mr-2">{qi + 1}.</span>
                    {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi;
                      const isCorrect = oi === q.correct;
                      let cls =
                        "border-white/10 hover:border-blue-500/40 bg-white/[0.02] hover:bg-blue-500/5 cursor-pointer";
                      if (submitted) {
                        if (isCorrect)
                          cls =
                            "border-green-500  bg-green-500/10  cursor-default";
                        else if (selected)
                          cls =
                            "border-red-500    bg-red-500/10    cursor-default";
                        else
                          cls =
                            "border-white/5    opacity-40       cursor-default";
                      } else if (selected)
                        cls = "border-blue-500   bg-blue-500/10";

                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [qi]: oi }))
                          }
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center justify-between gap-2 ${cls}`}
                        >
                          <span>{opt}</span>
                          {submitted && isCorrect && (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          )}
                          {submitted && selected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation (shown after submit) */}
                  {submitted && (
                    <div className="mt-3 flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-blue-400 flex-shrink-0">💡</span>
                      <p className="text-sm text-gray-300">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit / result */}
            {!submitted ? (
              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < lesson.quiz.length}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
              >
                Submit Answers
              </button>
            ) : (
              <div className="mt-8 glass rounded-xl p-6 border border-white/10 text-center">
                <div
                  className={`text-4xl font-bold mb-2 ${quizScore === lesson.quiz.length ? "text-green-400" : "text-yellow-400"}`}
                >
                  {quizScore}/{lesson.quiz.length}
                </div>
                <p className="text-gray-300 mb-2">
                  {quizScore === lesson.quiz.length
                    ? "Perfect score! 🎉"
                    : quizScore >= lesson.quiz.length / 2
                      ? "Good effort! Review the explanations above."
                      : "Keep going — review the theory and try again."}
                </p>
                <div className="flex gap-3 justify-center mt-6 flex-wrap">
                  {quizScore < lesson.quiz.length && (
                    <button
                      onClick={() => {
                        setAnswers({});
                        setSubmitted(false);
                        setXpEarned(false);
                      }}
                      className="flex items-center gap-2 text-sm border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Try Again
                    </button>
                  )}
                  <Link
                    href={`/courses/${lang}`}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Back to Course <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
