import fs from "fs/promises";
import path from "path";

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
import { checkK6Installed } from "../services/k6Checker.js";
import { getConfig } from "../services/configStore.js";
import {
  sendHeartbeat,
  getNextJob,
  uploadResult,
  uploadLogs,
  failJob,
  cancelJob,
  getJobStatus
} from "../services/api.js";
import { createK6Script } from "../services/scriptGenerator.js";
import { runK6, stopCurrentK6Process } from "../services/runner.js";
import { sleep } from "../utils/sleep.js";
import { VERSION } from "../utils/version.js";
import {
  drawBanner,
  drawCard,
  drawSummaryTable,
  logInfo,
  logSuccess,
  logWarn,
  logError,
  colors,
  symbols
} from "../utils/ui.js";

let isShuttingDown = false;

process.on("SIGINT", async () => {
  console.log("");
  logWarn("Stopping K6 Lab Agent runner...");

  isShuttingDown = true;
  stopCurrentK6Process();

  logSuccess("Agent runner stopped gracefully.");
  console.log("");
  process.exit(0);
});

export async function start() {
  drawBanner(VERSION, "ONLINE");


  try {
    logInfo("Checking k6 engine installation...");
    const k6Version = await checkK6Installed();

    let config = { agentName: "Local Agent", apiUrl: "https://k6lab.duckdns.org" };
    try {
      config = await getConfig();
    } catch (e) {}

    console.log("");
    drawCard(
      `${symbols.network} READY & WAITING FOR DASHBOARD JOBS`,
      [
        { label: "Agent Name", value: config.agentName, color: colors.brightCyan },
        { label: "API Server", value: config.apiUrl, color: colors.brightWhite },
        { label: "Load Engine", value: k6Version, color: colors.brightGreen },
        { label: "Status", value: "LISTENING (POLLING 3s)", color: colors.green },
        "---",
        { label: "Shortcut", value: "Press Ctrl+C to stop agent", color: colors.gray }
      ],
      colors.cyan
    );
    console.log("");

    let heartbeatCount = 0;

    while (!isShuttingDown) {
      try {
        await sendHeartbeat();
        heartbeatCount++;

        const job = await getNextJob();

        if (!job) {
          await sleep(3000);
          continue;
        }

        console.log("");
        drawCard(
          `${symbols.lightning} NEW TEST JOB RECEIVED`,
          [
            { label: "Test Name", value: job.name || job.id, color: colors.brightYellow },
            { label: "Target Method", value: job.config.method, color: colors.brightCyan },
            { label: "Target URL", value: job.config.url, color: colors.brightWhite },
            { label: "Virtual Users", value: `${job.config.vus} VUs`, color: colors.brightGreen },
            { label: "Duration", value: job.config.duration, color: colors.brightGreen }
          ],
          colors.magenta
        );
        console.log("");
        logInfo("Executing k6 script locally...");
        console.log(`${colors.gray}Please keep this terminal window open. Progress can be monitored in your dashboard.${colors.reset}`);
        console.log("");

        let cancelCheckInterval = null;
        let localCancelled = false;

        // 🔹 Background dashboard cancellation monitor
        cancelCheckInterval = setInterval(async () => {
          try {
            const statusData = await getJobStatus(job.id);
            if (statusData && statusData.status === "cancel_requested") {
              console.log("");
              logWarn("Cancellation requested from dashboard. Aborting k6 run...");
              localCancelled = true;
              stopCurrentK6Process();
              clearInterval(cancelCheckInterval);
            }
          } catch (err) {
            // Ignore status polling errors
          }
        }, 2000);

        let scriptPath = null;
        try {
          const scriptDetails = await createK6Script(job);
          scriptPath = scriptDetails.scriptPath;
          const { summaryPath, logsPath } = scriptDetails;

          const runResult = await runK6(scriptPath, job, logsPath);

          if (cancelCheckInterval) clearInterval(cancelCheckInterval);

          let summary = null;
          if (await pathExists(summaryPath)) {
            const rawSum = await fs.readFile(summaryPath, "utf8");
            summary = JSON.parse(rawSum);
          }

          await uploadLogs(job.id, runResult.logs);

          await uploadResult(job.id, {
            status: "completed",
            summary,
            logs: runResult.logs
          });

          console.log("");
          logSuccess(`Test "${job.name || job.id}" completed successfully!`);
          console.log("");

          if (summary) {
            drawSummaryTable(summary);
            console.log("");
          }

          logInfo("Results & logs uploaded to K6 Lab Cloud dashboard.");
          console.log("");
          logInfo("Waiting for new jobs...");
          console.log("");
        } catch (err) {
          if (cancelCheckInterval) clearInterval(cancelCheckInterval);

          if (localCancelled) {
            await cancelJob(job.id, "Test cancelled by user from dashboard");
            console.log("");
            logWarn("Test execution successfully cancelled.");
            console.log("");
          } else {
            // Check if backend cancellation requested in middle of execution
            try {
              const currentStatus = await getJobStatus(job.id);
              if (currentStatus && (currentStatus.status === "cancel_requested" || currentStatus.status === "cancelled")) {
                await cancelJob(job.id, "Test cancelled by user from dashboard");
                console.log("");
                logWarn("Test execution successfully cancelled.");
                console.log("");
                logInfo("Waiting for new jobs...");
                console.log("");
                
                if (scriptPath) {
                  try {
                    await fs.rm(path.dirname(scriptPath), { recursive: true, force: true });
                  } catch (cleanErr) {}
                }
                continue;
              }
            } catch (statusErr) {
              // fallback to failure
            }

            await failJob(job.id, err.message);

            console.log("");
            logError("Test execution failed.");
            logError(`Reason: ${err.message}`);
            console.log("");
            logInfo("Failure details & logs were reported to your dashboard.");
            console.log("");
          }

          logInfo("Waiting for new jobs...");
          console.log("");
        } finally {
          // 🧹 Clean up local job folder on success or error
          if (scriptPath) {
            try {
              await fs.rm(path.dirname(scriptPath), { recursive: true, force: true });
            } catch (cleanErr) {}
          }
        }
      } catch (err) {
        logError(`Agent connection error: ${err.message}`);
        await sleep(5000);
      }
    }
  } catch (err) {
    console.log("");
    logError(err.message);
    console.log("");
    console.log(`${colors.gray}Fix the issue and restart with:${colors.reset}`);
    console.log(`${colors.brightYellow}k6lab-agent start${colors.reset}`);
    console.log("");
    process.exit(1);
  }
}


