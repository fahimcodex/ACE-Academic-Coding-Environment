// lib/executors/python.js
//
// Loads Pyodide (Python in WebAssembly) and runs Python code in the browser.
// Pyodide is loaded lazily — only when the first Python lesson is opened.

let pyodideInstance = null;
let loadingPromise = null;

/**
 * Returns a ready Pyodide instance.
 * Caches it so it's only loaded once per session.
 */
export async function getPyodide(onStatus) {
  // Already loaded
  if (pyodideInstance) return pyodideInstance;

  // Currently loading — return the same promise
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    onStatus?.("⏳ Loading Python runtime (~5 MB, first time only)...");
    try {
      // Load Pyodide from CDN
      const { loadPyodide } = await import("pyodide");
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
      });
      onStatus?.("✅ Python ready!");
      return pyodideInstance;
    } catch (err) {
      loadingPromise = null; // allow retry
      throw new Error("Failed to load Python runtime: " + err.message);
    }
  })();

  return loadingPromise;
}

/**
 * Runs Python code and returns { output, error }.
 */
export async function runPython(code, onStatus) {
  const pyodide = await getPyodide(onStatus);

  let output = "";
  let error = "";

  // Redirect stdout and stderr
  pyodide.setStdout({
    batched: (line) => {
      output += line + "\n";
    },
  });
  pyodide.setStderr({
    batched: (line) => {
      error += line + "\n";
    },
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    // Python syntax / runtime errors
    error = err.message;
  }

  return {
    output: output.trimEnd(),
    error: error.trimEnd(),
  };
}
