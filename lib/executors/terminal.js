// lib/executors/terminal.js
//
// A simulated Linux terminal that runs entirely in the browser.
// Maintains a virtual file system in memory and handles common
// POSIX commands: pwd, ls, cd, mkdir, touch, rm, cat, echo, clear, help, etc.

// ── Virtual File System ───────────────────────────────────────────────────────
// Structure: { "/path/to/dir": { type:"dir"|"file", content:"" } }

export function createFileSystem() {
  return {
    "/": { type: "dir" },
    "/home": { type: "dir" },
    "/home/user": { type: "dir" },
    "/etc": { type: "dir" },
    "/var": { type: "dir" },
    "/tmp": { type: "dir" },
    "/home/user/readme.txt": {
      type: "file",
      content:
        "Welcome to the CodePath Linux Terminal!\nPractice Linux commands here.\n",
    },
  };
}

export function createTerminalState() {
  return {
    cwd: "/home/user",
    fs: createFileSystem(),
    env: { USER: "user", HOME: "/home/user", PATH: "/usr/bin:/bin" },
  };
}

// ── Path helpers ──────────────────────────────────────────────────────────────

function resolvePath(cwd, input) {
  if (!input || input === "~") return "/home/user";
  if (input.startsWith("/")) return normalizePath(input);
  return normalizePath(cwd + "/" + input);
}

function normalizePath(p) {
  const parts = p.split("/").filter(Boolean);
  const result = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") result.pop();
    else result.push(part);
  }
  return "/" + result.join("/");
}

function basename(p) {
  return p.split("/").filter(Boolean).pop() ?? "/";
}
function dirname(p) {
  const parts = p.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/") || "/";
}

function listDir(fs, path) {
  const prefix = path === "/" ? "/" : path + "/";
  return Object.keys(fs)
    .filter((k) => {
      if (k === path) return false;
      if (!k.startsWith(prefix)) return false;
      // Direct children only (no nested slashes after prefix)
      const rest = k.slice(prefix.length);
      return rest.length > 0 && !rest.includes("/");
    })
    .map((k) => ({ name: basename(k), ...fs[k] }));
}

// ── Command handlers ──────────────────────────────────────────────────────────

const COMMANDS = {
  pwd({ state }) {
    return state.cwd;
  },

  ls({ args, state }) {
    const target = args[0] ? resolvePath(state.cwd, args[0]) : state.cwd;
    const showAll =
      args.includes("-a") || args.includes("-la") || args.includes("-al");
    const long =
      args.includes("-l") || args.includes("-la") || args.includes("-al");

    if (!state.fs[target])
      return `ls: cannot access '${args[0]}': No such file or directory`;
    if (state.fs[target].type === "file") return basename(target);

    let items = listDir(state.fs, target);
    if (showAll)
      items = [
        { name: ".", type: "dir" },
        { name: "..", type: "dir" },
        ...items,
      ];

    if (!items.length) return "";

    if (long) {
      return items
        .map((item) => {
          const perms = item.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--";
          const size = item.type === "file" ? (item.content?.length ?? 0) : 0;
          return `${perms}  1 user user  ${String(size).padStart(5)}  ${item.name}`;
        })
        .join("\n");
    }

    // Colorize: dirs in bold, files normal
    return items
      .map((i) => (i.type === "dir" ? `\x1b[1;34m${i.name}\x1b[0m` : i.name))
      .join("  ");
  },

  cd({ args, state }) {
    const target = resolvePath(state.cwd, args[0] ?? "~");
    if (!state.fs[target]) return `cd: ${args[0]}: No such file or directory`;
    if (state.fs[target].type !== "dir")
      return `cd: ${args[0]}: Not a directory`;
    state.cwd = target;
    return "";
  },

  mkdir({ args, state }) {
    if (!args[0]) return "mkdir: missing operand";
    const target = resolvePath(state.cwd, args[0]);
    if (state.fs[target])
      return `mkdir: cannot create directory '${args[0]}': File exists`;
    const parent = dirname(target);
    if (!state.fs[parent])
      return `mkdir: cannot create directory '${args[0]}': No such file or directory`;
    state.fs[target] = { type: "dir" };
    return "";
  },

  touch({ args, state }) {
    if (!args[0]) return "touch: missing file operand";
    const target = resolvePath(state.cwd, args[0]);
    if (!state.fs[target]) {
      const parent = dirname(target);
      if (!state.fs[parent])
        return `touch: cannot touch '${args[0]}': No such file or directory`;
      state.fs[target] = { type: "file", content: "" };
    }
    return "";
  },

  echo({ args, state }) {
    // Handle: echo "text" > file  and  echo "text" >> file
    const redirectIdx = args.indexOf(">");
    const appendIdx = args.indexOf(">>");
    const rIdx =
      redirectIdx !== -1 ? redirectIdx : appendIdx !== -1 ? appendIdx : -1;
    const isAppend =
      appendIdx !== -1 && (redirectIdx === -1 || appendIdx < redirectIdx);

    const textParts = rIdx === -1 ? args : args.slice(0, rIdx);
    const text = textParts.join(" ").replace(/^['"]|['"]$/g, "") + "\n";

    if (rIdx !== -1 && args[rIdx + 1]) {
      const target = resolvePath(state.cwd, args[rIdx + 1]);
      const parent = dirname(target);
      if (!state.fs[parent])
        return `bash: ${args[rIdx + 1]}: No such file or directory`;
      if (isAppend && state.fs[target]?.type === "file") {
        state.fs[target].content += text;
      } else {
        state.fs[target] = { type: "file", content: text };
      }
      return "";
    }
    return text.trimEnd();
  },

  cat({ args, state }) {
    if (!args[0]) return "cat: missing file operand";
    const target = resolvePath(state.cwd, args[0]);
    if (!state.fs[target]) return `cat: ${args[0]}: No such file or directory`;
    if (state.fs[target].type === "dir")
      return `cat: ${args[0]}: Is a directory`;
    return state.fs[target].content || "";
  },

  rm({ args, state }) {
    const flags = args.filter((a) => a.startsWith("-"));
    const targets = args.filter((a) => !a.startsWith("-"));
    const recursive = flags.some((f) => f.includes("r") || f.includes("R"));

    if (!targets[0]) return "rm: missing operand";

    const target = resolvePath(state.cwd, targets[0]);
    if (!state.fs[target])
      return `rm: cannot remove '${targets[0]}': No such file or directory`;

    if (state.fs[target].type === "dir") {
      if (!recursive)
        return `rm: cannot remove '${targets[0]}': Is a directory (use -r to remove directories)`;
      // Remove directory and all children
      Object.keys(state.fs).forEach((k) => {
        if (k === target || k.startsWith(target + "/")) delete state.fs[k];
      });
    } else {
      delete state.fs[target];
    }
    return "";
  },

  cp({ args, state }) {
    if (args.length < 2) return "cp: missing destination file operand";
    const src = resolvePath(state.cwd, args[0]);
    const dest = resolvePath(state.cwd, args[1]);
    if (!state.fs[src]) return `cp: '${args[0]}': No such file or directory`;
    if (state.fs[src].type === "dir")
      return `cp: omitting directory '${args[0]}' (use -r)`;
    state.fs[dest] = { ...state.fs[src] };
    return "";
  },

  mv({ args, state }) {
    if (args.length < 2) return "mv: missing destination file operand";
    const src = resolvePath(state.cwd, args[0]);
    const dest = resolvePath(state.cwd, args[1]);
    if (!state.fs[src]) return `mv: '${args[0]}': No such file or directory`;
    state.fs[dest] = state.fs[src];
    delete state.fs[src];
    return "";
  },

  find({ args, state }) {
    const root = args[0] ? resolvePath(state.cwd, args[0]) : state.cwd;
    const nameArg =
      args.indexOf("-name") !== -1 ? args[args.indexOf("-name") + 1] : null;
    const results = Object.keys(state.fs).filter((k) => {
      if (!k.startsWith(root)) return false;
      if (nameArg)
        return (
          basename(k) === nameArg ||
          basename(k).includes(nameArg.replace("*", ""))
        );
      return true;
    });
    return results.length ? results.join("\n") : "";
  },

  grep({ args, state }) {
    const flags = args.filter((a) => a.startsWith("-"));
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    if (nonFlags.length < 2) return "grep: usage: grep [options] PATTERN FILE";
    const [pattern, filename] = nonFlags;
    const target = resolvePath(state.cwd, filename);
    if (!state.fs[target])
      return `grep: ${filename}: No such file or directory`;
    if (state.fs[target].type === "dir")
      return `grep: ${filename}: Is a directory`;
    const ignoreCase = flags.includes("-i");
    const lines = (state.fs[target].content || "").split("\n");
    const regex = new RegExp(pattern, ignoreCase ? "i" : "");
    const matched = lines.filter((l) => regex.test(l));
    return matched.join("\n");
  },

  wc({ args, state }) {
    if (!args[0]) return "wc: missing file operand";
    const target = resolvePath(state.cwd, args[0]);
    if (!state.fs[target]) return `wc: ${args[0]}: No such file or directory`;
    const content = state.fs[target].content || "";
    const lines = content.split("\n").length - 1;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    return `${String(lines).padStart(4)} ${String(words).padStart(4)} ${String(chars).padStart(4)} ${args[0]}`;
  },

  chmod({ args }) {
    if (args.length < 2) return "chmod: missing operand";
    return ""; // Simulate success silently
  },

  whoami({ state }) {
    return state.env.USER;
  },
  hostname() {
    return "codepath";
  },
  date() {
    return new Date().toString();
  },
  uname({ args }) {
    return args.includes("-a")
      ? "Linux codepath 5.15.0 #1 SMP x86_64 GNU/Linux"
      : "Linux";
  },

  history({ state }) {
    return (state.history ?? [])
      .map((cmd, i) => `${String(i + 1).padStart(4)}  ${cmd}`)
      .join("\n");
  },

  clear() {
    return "\x1bc";
  }, // ANSI clear screen

  help() {
    return [
      "Available commands:",
      "  pwd          — print working directory",
      "  ls [-la]     — list directory contents",
      "  cd [dir]     — change directory",
      "  mkdir <dir>  — create directory",
      "  touch <file> — create empty file",
      "  rm [-r] <f>  — remove file or directory",
      "  cp <src> <dst> — copy file",
      "  mv <src> <dst> — move/rename file",
      "  cat <file>   — print file contents",
      "  echo <text>  — print text (supports > and >>)",
      "  grep <p> <f> — search for pattern in file",
      "  find [dir]   — list files recursively",
      "  wc <file>    — word/line/char count",
      "  chmod        — change permissions (simulated)",
      "  whoami       — current user",
      "  hostname     — system hostname",
      "  date         — current date and time",
      "  uname [-a]   — system information",
      "  history      — command history",
      "  clear        — clear the terminal",
      "  help         — show this list",
    ].join("\n");
  },
};

// ── Main execute function ─────────────────────────────────────────────────────

/**
 * Parses and executes a shell command string.
 * @param {string} input         - Raw command string from the user
 * @param {object} state         - Terminal state (cwd, fs, env, history)
 * @returns {{ output: string, newState: object }}
 */
export function executeCommand(input, state) {
  const trimmed = input.trim();
  if (!trimmed) return { output: "", newState: state };

  // Record history
  const newState = {
    ...state,
    fs: { ...state.fs },
    history: [...(state.history ?? []), trimmed],
  };

  // Handle pipes (simple: only two segments, second must be grep or wc)
  if (trimmed.includes("|")) {
    const [left, right] = trimmed.split("|").map((s) => s.trim());
    const leftResult = executeCommand(left, newState);
    const rightParts = tokenize(right);
    const rightCmd = rightParts[0];

    if (rightCmd === "grep" && rightParts[1]) {
      const pattern = rightParts[1];
      const lines = leftResult.output.split("\n");
      const filtered = lines.filter((l) => l.includes(pattern));
      return { output: filtered.join("\n"), newState: leftResult.newState };
    }
    if (rightCmd === "wc") {
      const text = leftResult.output;
      const lines = text.split("\n").length;
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      return {
        output: `${lines} ${words} ${text.length}`,
        newState: leftResult.newState,
      };
    }
    return leftResult;
  }

  const parts = tokenize(trimmed);
  const command = parts[0];
  const args = parts.slice(1);

  const handler = COMMANDS[command];
  if (!handler) {
    return {
      output: `${command}: command not found\nType 'help' to see available commands.`,
      newState,
    };
  }

  try {
    const output = handler({ args, state: newState }) ?? "";
    return { output, newState };
  } catch (err) {
    return { output: `${command}: ${err.message}`, newState };
  }
}

// ── Tokenizer (handles quoted strings) ───────────────────────────────────────

function tokenize(input) {
  const tokens = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";

  for (const ch of input) {
    if (inQuote) {
      if (ch === quoteChar) {
        inQuote = false;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = true;
      quoteChar = ch;
    } else if (ch === " " || ch === "\t") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}
