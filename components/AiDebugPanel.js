"use client";

// components/AiDebugPanel.js
// AI debugging assistant — finds bugs and explains fixes

import { useState } from "react";
import { debugCode } from "@/lib/aiClient";
import { useAuth } from "@/lib/auth";
import { Bug, X, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AiDebugPanel({ code, language, lastOutput, onClose }) {
  const { user }            = useAuth();
  const [result,  setResult]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [errMsg,  setErrMsg]  = useState(
    lastOutput?.startsWith("❌") ? lastOutput.replace("❌ ", "") : ""
  );

  async function debug() {
    if (!user || !code.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const text = await debugCode(code, language, errMsg, user.uid);
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
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Bug className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">AI Debug Assistant</p>
            <p className="text-xs text-gray-400">Powered by Gemini</p>
          </div>
        </div>
        <button onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error input */}
      <div className="px-5 py-4 border-b border-white/10">
        <label className="text-xs text-gray-400 mb-2 block">
          Error message or describe what's wrong (optional):
        </label>
        <textarea
          value={errMsg}
          onChange={e => setErrMsg(e.target.value)}
          placeholder="Paste your error message, or describe what's not working..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/40 resize-none font-mono"
        />
        <button onClick={debug} disabled={loading || !user}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
            : <><Bug className="w-4 h-4" /> Find & Fix the Bug</>}
        </button>
      </div>

      {/* Result */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {!result && !loading && !error && (
          <div className="text-center py-10">
            <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Paste your error above (or leave blank)<br />
              and click "Find & Fix the Bug".
            </p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm font-mono whitespace-pre-wrap">❌ {error}</p>
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
