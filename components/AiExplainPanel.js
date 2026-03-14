"use client";

// components/AiExplainPanel.js
// Slide-in panel: explains code using Gemini AI

import { useState } from "react";
import { explainCode } from "@/lib/aiClient";
import { useAuth } from "@/lib/auth";
import { Brain, X, Loader2, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const LEVELS = ["beginner", "intermediate", "advanced"];

export default function AiExplainPanel({ code, language, onClose }) {
  const { user } = useAuth();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevel] = useState("beginner");
  const [levelOpen, setLevelOpen] = useState(false);

  async function explain() {
    if (!user || !code.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const text = await explainCode(code, language, level, user.uid);
      setResult(text);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-pink-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">AI Code Explanation</p>
            <p className="text-xs text-gray-400">Powered by Groq</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        {/* Level selector */}
        <div className="relative">
          <button
            onClick={() => setLevelOpen((v) => !v)}
            className="flex items-center gap-2 glass border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <span className="capitalize">{level}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {levelOpen && (
            <div className="absolute top-full mt-1 left-0 glass rounded-lg border border-white/10 py-1 z-10 w-36">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLevel(l);
                    setLevelOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm capitalize transition-colors hover:bg-white/5 ${
                    level === l ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={explain}
          disabled={loading || !user}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-1 justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Explaining...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" /> Explain this code
            </>
          )}
        </button>
      </div>

      {/* Result */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {!result && !loading && !error && (
          <div className="text-center py-10">
            <Brain className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Select your experience level and click
              <br />
              &quot;Explain this code&quot; to get a breakdown.
            </p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm font-mono whitespace-pre-wrap">
              ❌ {error}
            </p>
          </div>
        )}
        {result && (
          <div className="prose prose-invert prose-sm prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10 prose-code:text-blue-300 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
