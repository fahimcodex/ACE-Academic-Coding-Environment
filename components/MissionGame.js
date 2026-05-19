"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  ChevronDown,
  Lightbulb,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { runPython } from "@/lib/executors/python";
import { runWithJudge0 } from "@/lib/executors/judge0";
import { useAuth } from "@/lib/auth";
import { awardXP } from "@/lib/xpService";
import { db } from "@/lib/firebase";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const LANGUAGE_BADGES = {
  python: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  c: "bg-sky-500/20 text-sky-200 border-sky-500/40",
  cpp: "bg-purple-500/20 text-purple-200 border-purple-500/40",
};

export default function MissionGame({
  missionData,
  language,
  onComplete,
  onSkip,
}) {
  const { user, profile, updateProfile } = useAuth();
  const [code, setCode] = useState(missionData?.starterCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const missionLanguage = (
    language ||
    missionData?.language ||
    "python"
  ).toLowerCase();
  const badgeClass = LANGUAGE_BADGES[missionLanguage] || LANGUAGE_BADGES.python;

  const expectedOutput = useMemo(() => {
    return (missionData?.expectedOutput || "").trim();
  }, [missionData?.expectedOutput]);

  const canSkip = attempts >= 3 && !hasCompleted;

  const runCode = async () => {
    if (isRunning || hasCompleted) {
      return;
    }

    setIsRunning(true);
    setResult(null);

    let execution = { output: "", error: "" };

    try {
      if (missionLanguage === "python") {
        execution = await runPython(code);
      } else {
        execution = await runWithJudge0(code, missionLanguage);
      }
    } catch (error) {
      execution = { output: "", error: error?.message || "Execution failed." };
    }

    const actualOutput = (execution.output || "").trim();

    if (execution.error) {
      setAttempts((count) => count + 1);
      setResult({
        status: "error",
        message: execution.error,
        actualOutput,
      });
      setIsRunning(false);
      return;
    }

    if (actualOutput === expectedOutput) {
      setHasCompleted(true);
      setResult({ status: "success", actualOutput });
      const completeMission = async () => {
        try {
          await awardXP(user.uid, missionData.xpBonus, "mission_complete");
          const completionId = missionData?.id || missionData?.concept;
          if (completionId) {
            await setDoc(
              doc(db, "users", user.uid, "missionCompletions", completionId),
              {
                completedAt: serverTimestamp(),
                language: missionData?.language,
                xpEarned: missionData?.xpBonus,
              },
            );
          }

          const nextProfile = {
            missionsCompleted: (profile?.missionsCompleted ?? 0) + 1,
          };

          if (missionLanguage === "python") {
            nextProfile.pythonMissionsCompleted =
              (profile?.pythonMissionsCompleted ?? 0) + 1;
          } else if (missionLanguage === "c") {
            nextProfile.cMissionsCompleted =
              (profile?.cMissionsCompleted ?? 0) + 1;
          } else if (missionLanguage === "cpp") {
            nextProfile.cppMissionsCompleted =
              (profile?.cppMissionsCompleted ?? 0) + 1;
          }

          await updateProfile?.(nextProfile);
          onComplete?.(missionData?.xpBonus || 0);
        } catch (error) {
          onComplete?.(missionData?.xpBonus || 0);
        }
      };

      if (user) {
        await completeMission();
      } else {
        onComplete?.(missionData?.xpBonus || 0);
      }
    } else {
      setAttempts((count) => count + 1);
      setResult({
        status: "failure",
        actualOutput,
        expectedOutput,
      });
    }

    setIsRunning(false);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            {missionData?.storyTitle || "CodeQuest"}
          </h2>
          <span
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${badgeClass}`}
          >
            {missionLanguage}
          </span>
        </div>
        <p className="mt-4 text-sm italic text-slate-200">
          {missionData?.storyText}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-gray-950/80 p-6 shadow-lg backdrop-blur">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-white">Challenge</h3>
          <p className="text-sm text-slate-200">{missionData?.challenge}</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-gray-900/70">
          <MonacoEditor
            height="320px"
            language={missionLanguage}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value ?? "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runCode}
            disabled={isRunning || hasCompleted}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200/40 border-t-emerald-200" />
                Running...
              </span>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Code
              </>
            )}
          </button>

          {canSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              Skip mission
            </button>
          )}

          <span className="text-xs uppercase tracking-wide text-white/60">
            Attempts: {attempts}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsHintOpen((open) => !open)}
          className="mt-6 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          <span className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-200" />
            Hint
          </span>
          <ChevronDown
            className={`h-4 w-4 transition ${isHintOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isHintOpen && (
          <div className="mt-3 rounded-xl border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            {missionData?.hint}
          </div>
        )}

        {result?.status === "success" && (
          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-100">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle className="h-4 w-4" />
              Mission complete! You earned {missionData?.xpBonus || 0} XP.
            </div>
          </div>
        )}

        {result?.status === "failure" && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            <div className="flex items-center gap-2 font-semibold">
              <XCircle className="h-4 w-4" />
              Output mismatch. Try again.
            </div>
            <div className="mt-3 space-y-2 text-xs text-red-100/90">
              <div>
                <span className="font-semibold">Expected:</span>
                <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-black/30 p-2 text-red-50">
                  {result.expectedOutput}
                </pre>
              </div>
              <div>
                <span className="font-semibold">Actual:</span>
                <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-black/30 p-2 text-red-50">
                  {result.actualOutput || "(no output)"}
                </pre>
              </div>
            </div>
          </div>
        )}

        {result?.status === "error" && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            <div className="flex items-center gap-2 font-semibold">
              <XCircle className="h-4 w-4" />
              Execution error
            </div>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-black/30 p-2 text-xs text-red-50">
              {result.message}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
