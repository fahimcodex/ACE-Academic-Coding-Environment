"use client";

// components/LinuxTerminal.js

import { useState, useEffect, useRef } from "react";
import { createTerminalState, executeCommand } from "@/lib/executors/terminal";
import { RotateCcw } from "lucide-react";

const WELCOME_LINES = [
  { type: "output", text: "╔══════════════════════════════════════════╗" },
  { type: "output", text: "║   CodePath Linux Terminal  v1.0          ║" },
  { type: "output", text: "║   Type 'help' to see available commands  ║" },
  { type: "output", text: "╚══════════════════════════════════════════╝" },
  { type: "output", text: "" },
];

export default function LinuxTerminal() {
  const [lines, setLines] = useState(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [state, setState] = useState(() => createTerminalState());
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // ── Auto-scroll + initial focus ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (lines.length <= WELCOME_LINES.length) {
      inputRef.current?.focus();
    }
  }, [lines]);

  // ── Prompt string ──────────────────────────────────────────────────────────
  function prompt(st) {
    const cwd = st.cwd === "/home/user" ? "~" : st.cwd;
    return `user@codepath:${cwd}$`;
  }

  // ── Handle Enter ───────────────────────────────────────────────────────────
  function handleSubmit() {
    const cmd = input.trim();

    setLines((prev) => [
      ...prev,
      { type: "input", text: `${prompt(state)} ${input}` },
    ]);

    if (cmd) {
      const { output, newState } = executeCommand(cmd, state);

      if (output === "\x1bc") {
        setLines([]);
        setState(newState);
        setInput("");
        setHistIdx(-1);
        return;
      }

      if (output) {
        const outputLines = output
          .split("\n")
          .map((text) => ({ type: "output", text }));
        setLines((prev) => [...prev, ...outputLines]);
      }
      setState(newState);
    }

    setInput("");
    setHistIdx(-1);
  }

  // ── Key handlers ───────────────────────────────────────────────────────────
  function handleKeyDown(e) {
    const history = state.history ?? [];

    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const newIdx =
        histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(newIdx);
      setInput(history[newIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const newIdx = histIdx + 1;
      if (newIdx >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === "c" && e.ctrlKey) {
      setInput("");
      setLines((prev) => [
        ...prev,
        { type: "input", text: `${prompt(state)} ${input}^C` },
      ]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  // ── Tab completion ─────────────────────────────────────────────────────────
  function handleTabComplete() {
    const parts = input.split(" ");
    const last = parts[parts.length - 1];
    if (!last) return;

    const { fs, cwd } = state;
    const prefix = last.startsWith("/")
      ? last
      : cwd === "/"
        ? "/" + last
        : cwd + "/" + last;
    const matches = Object.keys(fs).filter(
      (k) => k.startsWith(prefix) && k !== prefix,
    );
    const names = [
      ...new Set(
        matches.map((k) => {
          const rest = k.slice(prefix.length);
          return last + rest.split("/")[0];
        }),
      ),
    ];

    if (names.length === 1) {
      parts[parts.length - 1] =
        names[0] + (fs[cwd + "/" + names[0]]?.type === "dir" ? "/" : "");
      setInput(parts.join(" "));
    } else if (names.length > 1) {
      setLines((prev) => [
        ...prev,
        { type: "input", text: `${prompt(state)} ${input}` },
        { type: "output", text: names.join("  ") },
      ]);
    }
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function resetTerminal() {
    setState(createTerminalState());
    setLines([...WELCOME_LINES, { type: "output", text: "Terminal reset." }]);
    setInput("");
    setHistIdx(-1);
    inputRef.current?.focus();
  }

  // ── Strip basic ANSI codes for display ────────────────────────────────────
  function renderText(text) {
    return text.replace(/\x1b\[[0-9;]*m/g, "");
  }

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden border border-white/10 bg-gray-950"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-400 font-mono">
            user@codepath:{state.cwd === "/home/user" ? "~" : state.cwd}
          </span>
        </div>
        <button
          onClick={resetTerminal}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Output area */}
      <div
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5"
        style={{ minHeight: 320, maxHeight: 420 }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "input" ? "text-green-400" : "text-gray-300"
            }
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
          >
            {renderText(line.text)}
          </div>
        ))}

        {/* Active input line */}
        <div className="flex items-center text-green-400">
          <span className="mr-2 whitespace-nowrap">{prompt(state)}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white caret-green-400 font-mono text-sm"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
