// lib/executors/terminal.js
//
// A simulated Linux terminal that runs entirely in the browser.
// Maintains a virtual file system in memory and handles common POSIX commands.

// ── Virtual File System ───────────────────────────────────────────────────────
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
      content: "Welcome to the CodePath Linux Terminal!\nPractice Linux commands here.\n",
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

function basename(p) { return p.split("/").filter(Boolean).pop() ?? "/"; }
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
      const rest = k.slice(prefix.length);
      return rest.length > 0 && !rest.includes("/");
    })
    .map((k) => ({ name: basename(k), ...fs[k] }));
}

// ── Command handlers ──────────────────────────────────────────────────────────

const COMMANDS = {
  pwd({ state }) { return state.cwd; },

  ls({ args, state }) {
    const target = args[0] && !args[0].startsWith('-') ? resolvePath(state.cwd, args[0]) : state.cwd;
    const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
    const long = args.includes("-l") || args.includes("-la") || args.includes("-al");

    if (!state.fs[target]) return `ls: cannot access '${target}': No such file or directory`;
    if (state.fs[target].type === "file") return basename(target);

    let items = listDir(state.fs, target);
    if (showAll) items = [{ name: ".", type: "dir" }, { name: "..", type: "dir" }, ...items];

    if (!items.length) return "";

    if (long) {
      return items.map((item) => {
        const perms = item.type === "dir" ? "drwxr-xr-x" : "-rwxr-xr-x"; // Made files executable for script lessons
        const size = item.type === "file" ? (item.content?.length ?? 0) : 4096;
        return `${perms}  1 user user  ${String(size).padStart(5)}  ${item.name}`;
      }).join("\n");
    }

    return items.map((i) => (i.type === "dir" ? `\x1b[1;34m${i.name}\x1b[0m` : i.name)).join("  ");
  },

  cd({ args, state }) {
    const target = resolvePath(state.cwd, args[0] ?? "~");
    if (!state.fs[target]) return `cd: ${args[0]}: No such file or directory`;
    if (state.fs[target].type !== "dir") return `cd: ${args[0]}: Not a directory`;
    state.cwd = target;
    return "";
  },

  mkdir({ args, state }) {
    if (!args[0]) return "mkdir: missing operand";
    const target = resolvePath(state.cwd, args[0]);
    if (state.fs[target]) return `mkdir: cannot create directory '${args[0]}': File exists`;
    const parent = dirname(target);
    if (!state.fs[parent]) return `mkdir: cannot create directory '${args[0]}': No such file or directory`;
    state.fs[target] = { type: "dir" };
    return "";
  },

  touch({ args, state }) {
    if (!args[0]) return "touch: missing file operand";
    const target = resolvePath(state.cwd, args[0]);
    if (!state.fs[target]) {
      const parent = dirname(target);
      if (!state.fs[parent]) return `touch: cannot touch '${args[0]}': No such file or directory`;
      state.fs[target] = { type: "file", content: "" };
    }
    return "";
  },

  echo({ args, state }) {
    const redirectIdx = args.indexOf(">");
    const appendIdx = args.indexOf(">>");
    const rIdx = redirectIdx !== -1 ? redirectIdx : appendIdx !== -1 ? appendIdx : -1;
    const isAppend = appendIdx !== -1 && (redirectIdx === -1 || appendIdx < redirectIdx);

    const textParts = rIdx === -1 ? args : args.slice(0, rIdx);
    const text = textParts.join(" ").replace(/^['"]|['"]$/g, "") + "\n";

    if (rIdx !== -1 && args[rIdx + 1]) {
      const target = resolvePath(state.cwd, args[rIdx + 1]);
      const parent = dirname(target);
      if (!state.fs[parent]) return `bash: ${args[rIdx + 1]}: No such file or directory`;
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
    if (state.fs[target].type === "dir") return `cat: ${args[0]}: Is a directory`;
    return state.fs[target].content || "";
  },

  rm({ args, state }) {
    const flags = args.filter((a) => a.startsWith("-"));
    const targets = args.filter((a) => !a.startsWith("-"));
    const recursive = flags.some((f) => f.includes("r") || f.includes("R"));

    if (!targets[0]) return "rm: missing operand";

    const target = resolvePath(state.cwd, targets[0]);
    if (!state.fs[target]) return `rm: cannot remove '${targets[0]}': No such file or directory`;

    if (state.fs[target].type === "dir") {
      if (!recursive) return `rm: cannot remove '${targets[0]}': Is a directory (use -r to remove directories)`;
      Object.keys(state.fs).forEach((k) => {
        if (k === target || k.startsWith(target + "/")) delete state.fs[k];
      });
    } else {
      delete state.fs[target];
    }
    return "";
  },

  grep({ args, state }) {
    const flags = args.filter((a) => a.startsWith("-"));
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    if (nonFlags.length < 2) return "grep: usage: grep [options] PATTERN FILE";
    const [pattern, filename] = nonFlags;
    const target = resolvePath(state.cwd, filename);
    if (!state.fs[target]) return `grep: ${filename}: No such file or directory`;

    const ignoreCase = flags.includes("-i");
    const lines = (state.fs[target].content || "").split("\n");
    const regex = new RegExp(pattern, ignoreCase ? "i" : "");
    return lines.filter((l) => regex.test(l)).join("\n");
  },

  // ── MOCKS FOR NEW LESSONS ───────────────────────────────────────────────────

  chmod({ args }) { return ""; }, // Simulated silent success
  chown({ args }) { return ""; }, // Simulated silent success

  ps() {
    return "  PID TTY          TIME CMD\n    1 ?        00:00:01 init\n   10 pts/0    00:00:00 bash\n   42 pts/0    00:00:00 ps";
  },

  kill({ args }) {
    if (!args[0]) return "kill: usage: kill [-s sigspec] pid";
    return `[1]+  Terminated              process ${args[args.length - 1]}`;
  },

  ping({ args }) {
    if (!args[0]) return "ping: usage error";
    return `PING ${args[0]} (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=119 time=14.2 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=119 time=15.1 ms\n--- ${args[0]} ping statistics ---\n2 packets transmitted, 2 packets received, 0.0% packet loss`;
  },

  wget({ args, state }) {
    if (!args[0]) return "wget: missing URL";
    const file = "index.html";
    state.fs[resolvePath(state.cwd, file)] = { type: "file", content: "<html><body>Downloaded web content</body></html>\n" };
    return `Saving to: '${file}'\n100%[===================>] 1,024  --.-KB/s    in 0s`;
  },

  curl({ args }) {
    if (!args[0]) return "curl: try 'curl --help' for more information";
    return `<html>\n  <head><title>Mock Webpage</title></head>\n  <body>\n    <h1>Hello from ${args[0]}</h1>\n  </body>\n</html>`;
  },

  awk({ args, state }) {
    if (args.length < 2) return "awk: syntax error";
    const script = args[0];
    const filename = args[1];
    const target = resolvePath(state.cwd, filename);
    if (!state.fs[target]) return `awk: cannot open ${filename} (No such file or directory)`;

    const lines = (state.fs[target].content || "").split("\n");
    // Mock parsing for '{print $N}'
    const match = script.match(/print\s+\$(\d+)/);
    if (match) {
      const col = parseInt(match[1], 10) - 1;
      return lines.filter(Boolean).map(l => l.split(/\s+/)[col] || "").join("\n");
    }
    return lines.join("\n");
  },

  sed({ args, state }) {
    if (args.length < 2) return "sed: no input files";
    const script = args[0];
    const filename = args[1];
    const target = resolvePath(state.cwd, filename);
    if (!state.fs[target]) return `sed: can't read ${filename}: No such file or directory`;

    let content = state.fs[target].content || "";
    // Mock for 's/old/new/g'
    const parts = script.split("/");
    if (parts[0] === "s" && parts.length >= 3) {
      const oldStr = parts[1];
      const newStr = parts[2];
      const isGlobal = parts[3] === "g";
      const regex = new RegExp(oldStr, isGlobal ? "g" : "");
      content = content.split("\n").map(l => l.replace(regex, newStr)).join("\n");
    }
    return content.trimEnd();
  },

  // ────────────────────────────────────────────────────────────────────────────

  clear() { return "\x1bc"; }, // ANSI clear screen

  help() {
    return [
      "Available commands:",
      "  pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, echo",
      "  grep, awk, sed — text processing",
      "  ps, kill       — process management",
      "  ping, wget     — networking",
      "  chmod, chown   — permissions",
      "  ./<script>     — run shell scripts",
      "  clear, help    — terminal controls"
    ].join("\n");
  },
};

// ── Main execute function ─────────────────────────────────────────────────────

export function executeCommand(input, state) {
  const trimmed = input.trim();
  if (!trimmed) return { output: "", newState: state };

  const newState = {
    ...state,
    fs: { ...state.fs },
    history: [...(state.history ?? []), trimmed],
  };

  // Handle Shell Script Execution (e.g., ./script.sh)
  if (trimmed.startsWith("./")) {
    const parts = tokenize(trimmed);
    const target = resolvePath(state.cwd, parts[0].slice(2));
    if (!newState.fs[target]) return { output: `bash: ${parts[0]}: No such file or directory`, newState };

    const scriptContent = newState.fs[target].content || "";
    const lines = scriptContent.split('\n').filter(l => l.trim() && !l.trim().startsWith('#!'));

    let fullOutput = [];
    let tempState = newState;
    for (const line of lines) {
      const res = executeCommand(line, tempState);
      if (res.output) fullOutput.push(res.output);
      tempState = res.newState;
    }
    return { output: fullOutput.join('\n'), newState: tempState };
  }

  // Handle Pipes
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