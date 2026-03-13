"use client";

import { useEffect, useState, useRef } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Zap,
  CheckCircle,
  XCircle,
  ChevronRight,
  Terminal,
  Code2,
} from "lucide-react";
import Link from "next/link";

// Load Monaco editor only on client (no SSR)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function LessonPage() {
  const { lang, lessonId } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState("theory"); // theory | code | quiz
  const [activeTab, setActiveTab] = useState("editor"); // editor | terminal
  const [quizDone, setQuizDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);
  const pyodideRef = useRef(null);

  // ── Load lesson ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "courses", lang, "lessons", lessonId));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setLesson(data);
        setCode(data.starterCode ?? "");
      }
      setLoading(false);
    }
    load();
  }, [lang, lessonId]);

  // ── Load Pyodide for Python ────────────────────────────────────────────────
  useEffect(() => {
    if (lesson?.language !== "python") return;
    async function loadPyodide() {
      if (pyodideRef.current) return;
      setOutput("⏳ Loading Python runtime...");
      try {
        const { loadPyodide } = await import("pyodide");
        pyodideRef.current = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        setOutput("✅ Python ready! Click Run to execute your code.");
      } catch (e) {
        setOutput("❌ Failed to load Python: " + e.message);
      }
    }
    loadPyodide();
  }, [lesson]);

  // ── Run code ───────────────────────────────────────────────────────────────
  async function runCode() {
    setRunning(true);
    setOutput("Running...");

    try {
      if (lesson.language === "python") {
        // Python via Pyodide
        if (!pyodideRef.current) {
          setOutput("Python runtime not ready yet.");
          setRunning(false);
          return;
        }
        let captured = "";
        pyodideRef.current.setStdout({
          batched: (s) => {
            captured += s + "\n";
          },
        });
        pyodideRef.current.setStderr({
          batched: (s) => {
            captured += "Error: " + s + "\n";
          },
        });
        await pyodideRef.current.runPythonAsync(code);
        setOutput(captured || "(no output)");
      } else if (lesson.language === "c" || lesson.language === "cpp") {
        // C / C++ via Judge0
        const langId = lesson.language === "c" ? 50 : 54;
        const res = await fetch(
          "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Key":
                process.env.NEXT_PUBLIC_JUDGE0_API_KEY ?? "PASTE_KEY",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            body: JSON.stringify({ source_code: code, language_id: langId }),
          },
        );
        const data = await res.json();
        setOutput(
          data.stdout || data.stderr || data.compile_output || "No output",
        );
      } else {
        setOutput("Use the Terminal tab to practice Linux commands.");
      }
    } catch (e) {
      setOutput("❌ Error: " + e.message);
    }
    setRunning(false);
  }

  // ── Submit quiz ────────────────────────────────────────────────────────────
  async function submitQuiz() {
    setSubmitted(true);
    const allCorrect = lesson.quiz.every((q, i) => answers[i] === q.correct);
    if (allCorrect && !xpEarned && user) {
      // Award XP
      const userRef = doc(db, "users", user.uid);
      const newXp = (profile?.xp ?? 0) + lesson.xpReward;
      const newLevel = Math.floor(newXp / 200) + 1;
      await setDoc(
        userRef,
        { xp: newXp, level: newLevel, lastActive: serverTimestamp() },
        { merge: true },
      );
      // Mark lesson complete
      await setDoc(doc(db, "progress", `${user.uid}_${lesson.id}`), {
        userId: user.uid,
        lessonId: lesson.id,
        courseId: lang,
        completedAt: serverTimestamp(),
        xpEarned: lesson.xpReward,
      });
      setXpEarned(true);
    }
    setQuizDone(allCorrect);
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

  const score = submitted
    ? lesson.quiz.filter((q, i) => answers[i] === q.correct).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      {/* ── Top bar ── */}
      <div className="pt-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/courses/${lang}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to course
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Zap className="w-4 h-4 text-yellow-400" />
            {lesson.xpReward} XP reward
          </div>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {["theory", "code", "quiz"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                tab === t
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {t === "theory"
                ? "📖 Theory"
                : t === "code"
                  ? "💻 Code"
                  : "🧠 Quiz"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* THEORY TAB */}
        {tab === "theory" && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
            <div className="prose prose-invert prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10 max-w-none">
              <ReactMarkdown>{lesson.theory}</ReactMarkdown>
            </div>
            <button
              onClick={() => setTab("code")}
              className="mt-10 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Open Code Editor <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CODE TAB */}
        {tab === "code" && (
          <div className="flex flex-col gap-4 h-full">
            <h2 className="text-xl font-bold">{lesson.title}</h2>

            {/* Editor / terminal toggle for Linux */}
            {lesson.language === "linux" && (
              <div className="flex gap-2">
                {[
                  ["editor", "Editor", Code2],
                  ["terminal", "Terminal", Terminal],
                ].map(([id, label, Icon]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === id
                        ? "bg-blue-600 text-white"
                        : "glass text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
              style={{ minHeight: 460 }}
            >
              {/* Editor */}
              <div className="glass rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                  <span className="text-sm text-gray-400 font-mono">
                    {lesson.language === "cpp"
                      ? "main.cpp"
                      : lesson.language === "c"
                        ? "main.c"
                        : "main.py"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCode(lesson.starterCode)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                    <button
                      onClick={runCode}
                      disabled={running}
                      className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-3 py-1 rounded transition-colors font-semibold"
                    >
                      <Play className="w-3 h-3" />{" "}
                      {running ? "Running..." : "Run"}
                    </button>
                  </div>
                </div>
                <MonacoEditor
                  height="400px"
                  language={
                    lesson.language === "cpp"
                      ? "cpp"
                      : lesson.language === "c"
                        ? "c"
                        : "python"
                  }
                  theme="vs-dark"
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                  }}
                />
              </div>

              {/* Output */}
              <div className="glass rounded-xl overflow-hidden border border-white/10">
                <div className="px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                  <span className="text-sm text-gray-400">Output</span>
                </div>
                <pre className="p-4 text-sm font-mono text-green-400 whitespace-pre-wrap overflow-auto h-[400px]">
                  {output || "Click Run to execute your code."}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setTab("quiz")}
              className="self-start flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Take the Quiz <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* QUIZ TAB */}
        {tab === "quiz" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Quick Quiz</h2>
            <p className="text-gray-400 mb-8">
              Answer all questions to earn your XP reward.
            </p>

            {xpEarned && (
              <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-4 mb-6">
                <Zap className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-300 font-semibold">
                  +{lesson.xpReward} XP earned! Great work!
                </p>
              </div>
            )}

            <div className="space-y-6">
              {lesson.quiz.map((q, qi) => (
                <div
                  key={q.id}
                  className="glass rounded-xl p-6 border border-white/10"
                >
                  <p className="font-semibold mb-4">
                    {qi + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = answers[qi] === oi;
                      const isCorrect = oi === q.correct;
                      let style =
                        "border-white/10 hover:border-blue-500/50 bg-white/[0.02] hover:bg-blue-500/5";
                      if (submitted) {
                        if (isCorrect)
                          style = "border-green-500 bg-green-500/10";
                        else if (isSelected)
                          style = "border-red-500 bg-red-500/10";
                        else style = "border-white/5 opacity-50";
                      } else if (isSelected) {
                        style = "border-blue-500 bg-blue-500/10";
                      }
                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [qi]: oi }))
                          }
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center justify-between ${style}`}
                        >
                          <span>{opt}</span>
                          {submitted && isCorrect && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                          {submitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p className="mt-3 text-sm text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!submitted ? (
              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < lesson.quiz.length}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors"
              >
                Submit Answers
              </button>
            ) : (
              <div className="mt-8 glass rounded-xl p-6 border border-white/10 text-center">
                <p className="text-2xl font-bold mb-1">
                  {score}/{lesson.quiz.length} correct
                </p>
                <p className="text-gray-400 mb-4">
                  {score === lesson.quiz.length
                    ? "Perfect score! 🎉"
                    : "Review the explanations above and try the next lesson."}
                </p>
                <Link
                  href={`/courses/${lang}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Back to Course <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
