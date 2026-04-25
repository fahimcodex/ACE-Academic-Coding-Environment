"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import LinuxTerminal from "@/components/LinuxTerminal";
import CommentSection from "@/components/CommentSection";
import AiExplainPanel from "@/components/AiExplainPanel";
import AiDebugPanel from "@/components/AiDebugPanel";
import XpToast from "@/components/XpToast";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { updateLessonProgress } from "@/lib/xpService";
import { auth } from "@/lib/firebase";

import {
  ArrowLeft, Play, RotateCcw, Zap, CheckCircle, XCircle,
  ChevronRight, Clock, Brain, Bug,
} from "lucide-react";
import Link from "next/link";
import { completeLesson } from "@/lib/xpService";
import { notify } from "@/lib/notifications";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

async function executePython(code, onStatus) {
  const { runPython } = await import("@/lib/executors/python");
  return runPython(code, onStatus);
}
async function executeC(code, lang) {
  const { runWithJudge0 } = await import("@/lib/executors/judge0");
  return runWithJudge0(code, lang);
}

const MONACO_LANG = { python: "python", c: "c", cpp: "cpp", linux: "shell" };
const FILE_NAME = { python: "main.py", c: "main.c", cpp: "main.cpp", linux: "script.sh" };

export default function LessonPage() {
  const { lang, lessonId } = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [execMeta, setExecMeta] = useState(null);
  const [tab, setTab] = useState("theory");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [toastEvent, setToastEvent] = useState(null);
  const [aiPanel, setAiPanel] = useState("none"); // "none" | "explain" | "debug"

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "courses", lang, "lessons", lessonId));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setLesson(data);
        setCode(data.starterCode ?? "");
        if (data.language === "python")
          setOutput("⏳ Python runtime loads on first Run (~5s).");
        else if (data.language !== "linux")
          setOutput("Click ▶ Run to compile and execute.");

        // 👇 NEW: Fetch the next lesson based on order 👇
        const nextQ = query(
          collection(db, "courses", lang, "lessons"), 
          where("order", "==", data.order + 1), 
          limit(1)
        );
        const nextSnap = await getDocs(nextQ);
        if (!nextSnap.empty) {
          setNextLesson({ id: nextSnap.docs[0].id, ...nextSnap.docs[0].data() });
        }
      }
      setLoading(false);
    }
    load();
  }, [lang, lessonId]);

  useEffect(() => {
    async function checkAccess() {
      if (!lesson || !user) return;
      if (lesson.order === 1) return; // Lesson 1 is always open

      const progSnap = await getDoc(doc(db, "users", user.uid, "courseProgress", lang));
      const highest = progSnap.exists() ? progSnap.data().highestCompletedOrder || 0 : 0;

      if (lesson.order > highest + 1) {
        alert("Lesson locked! Complete the previous quiz to unlock.");
        router.push(`/courses/${lang}`);
      }
    }
    checkAccess();
  }, [lesson, user, lang, router]);

  const runCode = useCallback(async () => {
    if (!lesson || running) return;
    setRunning(true);
    setExecMeta(null);
    try {
      if (lesson.language === "python") {
        setOutput("Running Python...");
        const { output: out, error } = await executePython(code, msg => setOutput(msg));
        setOutput(error ? `❌ Error:\n${error}` : out || "(no output)");
      } else if (lesson.language === "c" || lesson.language === "cpp") {
        setOutput("⏳ Compiling...");
        const result = await executeC(code, lesson.language);
        if (result.error) setOutput(result.error);
        else {
          setOutput(result.output || "(no output)");
          if (result.time) setExecMeta({ time: result.time, memory: result.memory });
        }
      } else {
        setOutput("Use the Terminal tab for Linux commands.");
      }
    } catch (err) {
      setOutput("❌ " + err.message);
    }
    setRunning(false);
  }, [lesson, code, running]);

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runCode]);

  async function submitQuiz() {
    setSubmitted(true);
    const allCorrect = lesson.quiz.every((q, i) => answers[i] === q.correct);
    if (allCorrect && user) {
      const result = await completeLesson(user.uid, lesson.id, lang, lesson.xpReward);
      await updateLessonProgress(user.uid, lang, lesson.order);
      if (result) {
        setToastEvent({
          xp: lesson.xpReward, reason: "Lesson Complete!",
          leveledUp: result.leveledUp, newLevel: result.newLevel,
          newBadges: result.newBadges,
        });
        await notify.xp(user.uid, lesson.xpReward, lesson.title);
        if (result.leveledUp) await notify.levelUp(user.uid, result.newLevel);
        for (const b of (result.newBadges ?? [])) await notify.badge(user.uid, b.replace(/_/g, " "));
        if ([3, 7, 30].includes(result.newStreak)) await notify.streak(user.uid, result.newStreak);
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!lesson) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Lesson not found.
    </div>
  );

  const quizScore = submitted ? lesson.quiz.filter((q, i) => answers[i] === q.correct).length : 0;
  const isLinux = lesson.language === "linux";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />
      <XpToast event={toastEvent} onDone={() => setToastEvent(null)} />

      {/* Top bar */}
      <div className="pt-16 border-b border-white/5 bg-gray-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link href={`/courses/${lang}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-sm font-semibold text-gray-200 truncate max-w-xs">{lesson.title}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:flex items-center gap-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />{lesson.duration}
            </span>
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />{lesson.xpReward} XP
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex">
          {[
            { id: "theory", label: "📖 Theory" },
            { id: "code", label: isLinux ? "🖥️ Terminal" : "💻 Code" },
            { id: "quiz", label: "🧠 Quiz" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 ${tab === t.id ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-white"
                }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">

        {/* THEORY */}
        {tab === "theory" && (
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-invert prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10 prose-code:text-blue-300 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.theory}</ReactMarkdown>
            </article>
            <button onClick={() => setTab("code")}
              className="mt-10 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              {isLinux ? "Open Terminal" : "Open Code Editor"} <ChevronRight className="w-4 h-4" />
            </button>
            <CommentSection lessonId={lessonId} />
          </div>
        )}

        {/* CODE / TERMINAL */}
        {tab === "code" && (
          <div className="flex flex-col gap-4">
            {isLinux ? (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Type <code className="text-blue-400">help</code> to see all available commands.
                </p>
                <LinuxTerminal />
              </div>
            ) : (
              <div className="flex gap-4">
                {/* Editor + output */}
                <div className={`flex flex-col gap-4 transition-all duration-300 ${aiPanel !== "none" ? "flex-1 min-w-0" : "w-full"}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Editor */}
                    <div className="glass rounded-xl overflow-hidden border border-white/10">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/10">
                        <span className="text-xs text-gray-400 font-mono">{FILE_NAME[lesson.language]}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500 hidden sm:block">Ctrl+Enter</span>
                          <button onClick={() => setCode(lesson.starterCode)}
                            title="Reset code"
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors">
                            <RotateCcw className="w-3 h-3" />
                          </button>
                          {/* AI buttons — only shown when signed in */}
                          {user && (
                            <>
                              <button
                                onClick={() => setAiPanel(p => p === "explain" ? "none" : "explain")}
                                title="AI Explain"
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${aiPanel === "explain"
                                    ? "bg-pink-600 text-white"
                                    : "text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                                  }`}>
                                <Brain className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Explain</span>
                              </button>
                              <button
                                onClick={() => setAiPanel(p => p === "debug" ? "none" : "debug")}
                                title="AI Debug"
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${aiPanel === "debug"
                                    ? "bg-red-600 text-white"
                                    : "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  }`}>
                                <Bug className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Debug</span>
                              </button>
                            </>
                          )}
                          <button onClick={runCode} disabled={running}
                            className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded font-semibold transition-colors">
                            <Play className="w-3 h-3" />{running ? "..." : "Run"}
                          </button>
                        </div>
                      </div>
                      <MonacoEditor
                        height="400px"
                        language={MONACO_LANG[lesson.language]}
                        theme="vs-dark"
                        value={code}
                        onChange={v => setCode(v ?? "")}
                        options={{
                          fontSize: 14, minimap: { enabled: false },
                          scrollBeyondLastLine: false, padding: { top: 12, bottom: 12 },
                          tabSize: lesson.language === "python" ? 4 : 2, wordWrap: "on",
                        }}
                      />
                    </div>

                    {/* Output */}
                    <div className="glass rounded-xl overflow-hidden border border-white/10">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/10">
                        <span className="text-xs text-gray-400">Output</span>
                        {execMeta && (
                          <span className="text-xs text-gray-500">
                            {execMeta.time}s · {Math.round((execMeta.memory ?? 0) / 1024)}KB
                          </span>
                        )}
                      </div>
                      <pre className={`p-4 text-sm font-mono whitespace-pre-wrap overflow-auto h-[400px] ${output.startsWith("❌") ? "text-red-400" : "text-green-400"
                        }`}>
                        {output || "Click ▶ Run to execute your code."}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {!user && (
                      <p className="text-xs text-gray-500">
                        <Link href="/" className="text-blue-400 hover:underline">Sign in</Link> to use AI Explain & Debug
                      </p>
                    )}
                    <div className="ml-auto">
                      <button onClick={() => setTab("quiz")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                        Take the Quiz <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI panel (slides in from right) */}
                {aiPanel !== "none" && (
                  <div className="w-80 flex-shrink-0 glass rounded-xl border border-white/10 overflow-hidden flex flex-col"
                    style={{ minHeight: 480 }}>
                    {aiPanel === "explain" && (
                      <AiExplainPanel
                        code={code}
                        language={lesson.language}
                        onClose={() => setAiPanel("none")}
                      />
                    )}
                    {aiPanel === "debug" && (
                      <AiDebugPanel
                        code={code}
                        language={lesson.language}
                        lastOutput={output}
                        onClose={() => setAiPanel("none")}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* QUIZ */}
        {tab === "quiz" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Quick Quiz</h2>
              <span className="text-sm text-gray-400">{lesson.quiz.length} questions</span>
            </div>
            <p className="text-gray-400 mb-8">
              Answer all correctly to earn{" "}
              <span className="text-yellow-400 font-semibold">+{lesson.xpReward} XP</span>.
            </p>

            <div className="space-y-6">
              {lesson.quiz.map((q, qi) => (
                <div key={q.id} className="glass rounded-xl p-6 border border-white/10">
                  <p className="font-semibold mb-4 leading-relaxed">
                    <span className="text-blue-400 mr-2">{qi + 1}.</span>{q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi;
                      const isCorrect = oi === q.correct;
                      let cls = "border-white/10 hover:border-blue-500/40 bg-white/[0.02] cursor-pointer";
                      if (submitted) {
                        if (isCorrect) cls = "border-green-500 bg-green-500/10 cursor-default";
                        else if (selected) cls = "border-red-500   bg-red-500/10   cursor-default";
                        else cls = "border-white/5   opacity-40      cursor-default";
                      } else if (selected) cls = "border-blue-500 bg-blue-500/10";
                      return (
                        <button key={oi} disabled={submitted}
                          onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center justify-between gap-2 ${cls}`}>
                          <span>{opt}</span>
                          {submitted && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                          {submitted && selected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div className="mt-3 flex gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-blue-400 flex-shrink-0">💡</span>
                      <p className="text-sm text-gray-300">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!submitted ? (
              <button onClick={submitQuiz}
                disabled={Object.keys(answers).length < lesson.quiz.length}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg">
                Submit Answers
              </button>
            ) : (
              <div className="mt-8 glass rounded-xl p-6 border border-white/10 text-center">
                <div className={`text-4xl font-bold mb-2 ${quizScore === lesson.quiz.length ? "text-green-400" : "text-yellow-400"}`}>
                  {quizScore}/{lesson.quiz.length}
                </div>
                <p className="text-gray-300 mb-6">
                  {quizScore === lesson.quiz.length ? "Perfect score! 🎉" : "Review the explanations above."}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {quizScore < lesson.quiz.length && (
                    <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                      className="flex items-center gap-2 text-sm border border-white/10 hover:border-white/20 text-gray-300 px-5 py-2.5 rounded-xl transition-colors">
                      <RotateCcw className="w-4 h-4" /> Try Again
                    </button>
                  )}
                  {quizScore === lesson.quiz.length && nextLesson && (
                    <Link href={`/courses/${lang}/${nextLesson.id}`}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                      Next: {nextLesson.title} <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            <CommentSection lessonId={lessonId} />
          </div>
        )}
      </div>
    </div>
  );
}
