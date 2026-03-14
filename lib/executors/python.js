// lib/executors/python.js

let pyodideInstance = null;
let loadingPromise = null;

export async function getPyodide(onStatus) {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    onStatus?.("⏳ Loading Python runtime (~5 MB, first time only)...");
    try {
      // Load Pyodide directly from CDN script instead of npm import
      await loadPyodideFromCDN();

      pyodideInstance = await globalThis.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
      });

      onStatus?.("✅ Python ready!");
      return pyodideInstance;
    } catch (err) {
      loadingPromise = null;
      throw new Error("Failed to load Python runtime: " + err.message);
    }
  })();

  return loadingPromise;
}

// Injects the Pyodide CDN script tag into the page if not already loaded
function loadPyodideFromCDN() {
  return new Promise((resolve, reject) => {
    if (globalThis.loadPyodide) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Failed to load Pyodide script from CDN"));
    document.head.appendChild(script);
  });
}

export async function runPython(code, onStatus) {
  const pyodide = await getPyodide(onStatus);

  let output = "";
  let error = "";

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
    error = err.message;
  }

  return {
    output: output.trimEnd(),
    error: error.trimEnd(),
  };
}
