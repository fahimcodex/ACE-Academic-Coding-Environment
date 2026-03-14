// lib/executors/judge0.js
//
// Submits C or C++ code to the Judge0 API (via RapidAPI) for compilation
// and execution. Returns stdout, stderr, or compile errors.

// Judge0 language IDs
const LANGUAGE_IDS = {
  c: 50, // C (GCC 9.2.0)
  cpp: 54, // C++ (GCC 9.2.0)
};

// const JUDGE0_URL =
//   "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
// const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY;
const JUDGE0_URL =
  "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

/**
 * Submits code to Judge0 and returns the result.
 * @param {string} code     - Source code to compile and run
 * @param {"c"|"cpp"} lang  - Language identifier
 * @param {string} stdin    - Optional stdin input
 */
export async function runWithJudge0(code, lang, stdin = "") {
  const languageId = LANGUAGE_IDS[lang];
  if (!languageId) {
    return { output: "", error: `Unknown language: ${lang}` };
  }

  try {
    const response = await fetch(JUDGE0_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: stdin,
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        output: "",
        error: `Judge0 API error ${response.status}: ${text}`,
      };
    }

    const result = await response.json();

    // Judge0 status codes:
    // 3 = Accepted, 4 = Wrong Answer, 5 = TLE, 6 = Compile Error, 11 = Runtime Error
    const status = result.status?.description ?? "Unknown";

    if (result.compile_output) {
      return {
        output: "",
        error: `Compilation Error:\n${result.compile_output}`,
      };
    }

    if (result.stderr) {
      return {
        output: result.stdout ?? "",
        error: `Runtime Error:\n${result.stderr}`,
      };
    }

    if (result.status?.id === 5) {
      return { output: "", error: "Time Limit Exceeded (5 seconds)" };
    }

    return {
      output: result.stdout ?? "(no output)",
      error: "",
      status,
      time: result.time,
      memory: result.memory,
    };
  } catch (err) {
    return {
      output: "",
      error:
        "Network error: " + err.message + "\n\nCheck your internet connection.",
    };
  }
}
