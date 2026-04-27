"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import LevelBar from "@/components/LevelBar";
import XpToast from "@/components/XpToast";
import dynamic from "next/dynamic";
import {
  Zap,
  Flame,
  Trophy,
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  Lock,
} from "lucide-react";
import { todayString } from "@/lib/gamification";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
const MONACO_LANG = { python: "python", c: "c", cpp: "cpp" };
const FILE_NAME = {
  python: "solution.py",
  c: "solution.c",
  cpp: "solution.cpp",
};

function normalizeChallengeLang(language) {
  const raw = String(language ?? "python").toLowerCase();
  if (raw === "c++") return "cpp";
  if (raw === "c" || raw === "cpp" || raw === "python") return raw;
  return "python";
}

async function executePython(code, onStatus) {
  const { runPython } = await import("@/lib/executors/python");
  return runPython(code, onStatus);
}

async function executeNative(code, lang) {
  const { runWithJudge0 } = await import("@/lib/executors/judge0");
  return runWithJudge0(code, lang);
}

export default function ChallengePage() {
  const { user, profile, updateProfile } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [toastEvent, setToastEvent] = useState(null);

  const today = todayString();
  const challengeLang = normalizeChallengeLang(challenge?.language);

  // ── Load today's challenge ─────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "challenges", today));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setChallenge(data);
        setCode(data.starterCode ?? "");
      }
      // Check if user already completed today
      if (user) {
        const doneSnap = await getDoc(
          doc(db, "challengeCompletions", `${user.uid}_${today}`),
        );
        if (doneSnap.exists()) setCompleted(true);
      }
      setLoading(false);
    }
    load();
  }, [today, user]);

  // ── Run code ───────────────────────────────────────────────────────────────
  const runCode = useCallback(async () => {
    if (!challenge || running) return;
    setRunning(true);
    setOutput("Running...");

    try {
      if (challengeLang === "python") {
        const { output: out, error } = await executePython(code, (msg) =>
          setOutput(msg),
        );
        setOutput(error ? `❌ Error:\n${error}` : out || "(no output)");
      } else {
        setOutput("⏳ Compiling...");
        const result = await executeNative(code, challengeLang);
        setOutput(
          result.error ? `❌ ${result.error}` : result.output || "(no output)",
        );
      }
    } catch (e) {
      setOutput("❌ " + e.message);
    } finally {
      setRunning(false);
    }
  }, [challenge, challengeLang, code, running]);

  // ── Submit solution ────────────────────────────────────────────────────────
  async function submitSolution() {
    if (!user || completed || running || !challenge) return;
    setRunning(true);
    setOutput("⏳ Validating on server...");

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`❌ ${data.error ?? "Submission failed"}`);
        return;
      }

      if (data.alreadyCompleted) {
        setCompleted(true);
        setOutput("✅ Challenge already completed for today.");
        return;
      }

      if (!data.correct) {
        setOutput(
          data.message
            ? `❌ ${data.message}`
            : "❌ Incorrect output. Try again.",
        );
        return;
      }

      setCompleted(true);
      setOutput("✅ Correct output! Challenge completed.");

      const earnedXp = data.reward?.xp ?? challenge.xpReward;
      const newTotalXp = data.reward?.newXp ?? profile?.xp + earnedXp;
      const newLevel = data.reward?.newLevel ?? profile?.level;

      // Optimistic UI Update for immediate XP rendering
      if (updateProfile && profile) {
        updateProfile({
          xp: newTotalXp,
          level: newLevel,
          streak: data.reward?.newStreak ?? profile.streak,
          badges: data.reward?.newBadges
            ? [...profile.badges, ...data.reward.newBadges]
            : profile.badges,
        });
      }

      setToastEvent({
        xp: earnedXp,
        reason: "Daily Challenge Complete!",
        leveledUp: data.reward?.leveledUp,
        newLevel: newLevel,
        newBadges: data.reward?.newBadges,
      });
    } catch (err) {
      setOutput("❌ " + err.message);
    } finally {
      setRunning(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <XpToast event={toastEvent} onDone={() => setToastEvent(null)} />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-1">
              <Trophy className="w-4 h-4" /> Daily Challenge
            </div>
            <h1 className="text-3xl font-bold">
              {challenge ? challenge.title : "No challenge today"}
            </h1>
            <p className="text-gray-400 mt-1">{today}</p>
          </div>
          {challenge && (
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                  challenge.difficulty === "Easy"
                    ? "text-green-400 border-green-500/30 bg-green-500/10"
                    : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                }`}
              >
                {challenge.difficulty}
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Zap className="w-4 h-4" />
                {challenge.xpReward} XP
              </div>
            </div>
          )}
        </div>

        {!challenge ? (
          <div className="glass rounded-2xl p-10 border border-white/10 text-center">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              No challenge scheduled for today. Check back tomorrow!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: description */}
            <div className="flex flex-col gap-4">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-bold text-lg mb-3">
                  Challenge Description
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Hint */}
                <div className="mt-4">
                  {showHint ? (
                    <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-300">
                        {challenge.hint}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" /> Show hint
                    </button>
                  )}
                </div>
              </div>

              {/* Completed banner */}
              {completed && (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-green-400">
                      Challenge Complete!
                    </p>
                    <p className="text-sm text-green-400/70">
                      You earned {challenge.xpReward} XP today.
                    </p>
                  </div>
                </div>
              )}

              {/* Level bar */}
              {profile && (
                <LevelBar xp={profile.xp ?? 0} level={profile.level ?? 1} />
              )}
            </div>

            {/* Right: editor */}
            <div className="flex flex-col gap-3">
              <div className="glass rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/10">
                  <span className="text-xs text-gray-400 font-mono">
                    {FILE_NAME[challengeLang]}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCode(challenge.starterCode)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                    <button
                      onClick={runCode}
                      disabled={running}
                      className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-3 py-1.5 rounded font-semibold"
                    >
                      <Play className="w-3 h-3" />{" "}
                      {running ? "Running..." : "Run"}
                    </button>
                  </div>
                </div>
                <MonacoEditor
                  height="280px"
                  language={MONACO_LANG[challengeLang]}
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
                  <span className="text-xs text-gray-400">Output</span>
                </div>
                <pre
                  className={`p-4 text-sm font-mono whitespace-pre-wrap h-32 overflow-auto ${
                    output.startsWith("❌") ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {output || "Click Run to test your code."}
                </pre>
              </div>

              {/* Submit */}
              {!completed ? (
                user ? (
                  <button
                    onClick={submitSolution}
                    disabled={running}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" /> Submit Solution & Earn{" "}
                    {challenge.xpReward} XP
                  </button>
                ) : (
                  <div className="flex items-center gap-2 glass rounded-xl p-4 border border-white/10 text-gray-400 text-sm">
                    <Lock className="w-4 h-4" /> Sign in to submit your solution
                    and earn XP.
                  </div>
                )
              ) : (
                <div className="w-full bg-green-600/20 border border-green-500/30 text-green-400 font-bold py-3 rounded-xl text-center">
                  ✓ Submitted — come back tomorrow for a new challenge!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
