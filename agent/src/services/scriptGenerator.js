import fs from "fs/promises";
import os from "os";
import path from "path";

export async function createK6Script(job) {
  // Sanitize job ID to prevent directory traversal
  const rawId = String(job.id || "job").replace(/[^a-zA-Z0-9_-]/g, "");
  const safeJobId = rawId.length > 0 ? rawId : "job_" + Date.now();

  const jobDir = path.join(os.homedir(), ".k6lab", "jobs", safeJobId);

  await fs.mkdir(jobDir, { recursive: true, mode: 0o700 });

  const scriptPath = path.join(jobDir, "script.js");
  const summaryPath = path.join(jobDir, "summary.json");
  const logsPath = path.join(jobDir, "logs.txt");
  const metadataPath = path.join(jobDir, "metadata.json");

  await fs.writeFile(
    metadataPath,
    JSON.stringify(
      {
        jobId: job.id,
        name: job.name,
        config: job.config,
        createdAt: new Date().toISOString()
      },
      null,
      2
    ),
    { encoding: "utf8", mode: 0o600 }
  );

  // Safely JSON-encode the summaryPath string so it is embedded cleanly without JS injection
  const jsonSummaryPath = JSON.stringify(summaryPath);

  const script = `
import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  vus: Number(__ENV.K6LAB_VUS || 1),
  duration: __ENV.K6LAB_DURATION || "10s",
};

export default function () {
  const method = __ENV.K6LAB_METHOD || "GET";
  const url = __ENV.K6LAB_URL;

  const headers = JSON.parse(__ENV.K6LAB_HEADERS || "{}");
  const body = __ENV.K6LAB_BODY || null;

  const params = {
    headers,
    timeout: __ENV.K6LAB_TIMEOUT || "30s"
  };

  const res = http.request(method, url, body, params);

  check(res, {
    "status is expected": (r) => {
      const expectedStatus = Number(__ENV.K6LAB_EXPECTED_STATUS || 200);
      return r.status === expectedStatus;
    },
    "response time is acceptable": (r) => {
      const maxMs = Number(__ENV.K6LAB_MAX_RESPONSE_TIME_MS || 1000);
      return r.timings.duration < maxMs;
    }
  });

  const sleepSeconds = Number(__ENV.K6LAB_SLEEP_SECONDS || 1);
  sleep(sleepSeconds);
}

export function handleSummary(data) {
  return {
    [${jsonSummaryPath}]: JSON.stringify(data)
  };
}
`.trim();

  await fs.writeFile(scriptPath, script, { encoding: "utf8", mode: 0o600 });

  return {
    jobDir,
    scriptPath,
    summaryPath,
    logsPath,
    metadataPath
  };
}
