import { spawn } from "child_process";
import fs from "fs-extra";

let currentProcess = null;

export function stopCurrentK6Process() {
  if (currentProcess) {
    currentProcess.kill("SIGTERM");
  }
}

export function runK6(scriptPath, job, logsPath) {
  return new Promise((resolve, reject) => {
    currentProcess = spawn("k6", ["run", scriptPath], {
      shell: false,
      env: {
        ...process.env,

        K6LAB_URL: job.config.url,
        K6LAB_METHOD: job.config.method,
        K6LAB_VUS: String(job.config.vus),
        K6LAB_DURATION: job.config.duration,

        K6LAB_HEADERS: JSON.stringify(job.config.headers || {}),
        K6LAB_BODY:
          job.config.body === null || job.config.body === undefined
            ? ""
            : typeof job.config.body === "string"
              ? job.config.body
              : JSON.stringify(job.config.body),

        K6LAB_EXPECTED_STATUS: String(job.config.expectedStatus || 200),
        K6LAB_MAX_RESPONSE_TIME_MS: String(job.config.maxResponseTimeMs || 1000),
        K6LAB_SLEEP_SECONDS: String(job.config.sleepSeconds ?? 1),
        K6LAB_TIMEOUT: job.config.timeout || "30s"
      }
    });

    let stdout = "";
    let stderr = "";

    currentProcess.stdout.on("data", async (data) => {
      const text = data.toString();
      stdout += text;
      await fs.appendFile(logsPath, text);
    });

    currentProcess.stderr.on("data", async (data) => {
      const text = data.toString();
      stderr += text;
      await fs.appendFile(logsPath, text);
    });

    currentProcess.on("error", (err) => {
      currentProcess = null;
      reject(err);
    });

    currentProcess.on("close", (code) => {
      currentProcess = null;

      if (code === 0) {
        resolve({
          stdout,
          stderr,
          logs: stdout + stderr
        });
      } else {
        reject(new Error(`k6 exited with code ${code}\n${stderr || stdout}`));
      }
    });
  });
}
