import fs from "fs-extra";
import { checkK6Installed } from "../services/k6Checker.js";
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

let isShuttingDown = false;

process.on("SIGINT", async () => {
  console.log("");
  console.log("Stopping K6 Lab Agent...");

  isShuttingDown = true;
  stopCurrentK6Process();

  console.log("Agent stopped.");
  process.exit(0);
});

export async function start() {
  console.log("");
  console.log("Starting K6 Lab Agent...");
  console.log("");

  try {
    console.log("Checking k6 installation...");
    await checkK6Installed();

    console.log("k6 is installed and ready.");
    console.log("");
    console.log("Connected to K6 Lab dashboard.");
    console.log("Agent is online.");
    console.log("");
    console.log("You can now create a test from your dashboard.");
    console.log("Waiting for jobs...");
    console.log("");

    while (!isShuttingDown) {
      try {
        await sendHeartbeat();

        const job = await getNextJob();

        if (!job) {
          await sleep(3000);
          continue;
        }

        console.log("");
        console.log(`New test received: ${job.name || job.id}`);
        console.log("");
        console.log(`${job.config.method} ${job.config.url}`);
        console.log(`VUs: ${job.config.vus}`);
        console.log(`Duration: ${job.config.duration}`);
        console.log("");
        console.log("Running k6 locally...");
        console.log("Please keep this terminal open.");
        console.log("You can monitor progress in your K6 Lab dashboard.");
        console.log("");

        let cancelCheckInterval = null;
        let localCancelled = false;

        // 🔹 Background dashboard cancellation monitor
        cancelCheckInterval = setInterval(async () => {
          try {
            const statusData = await getJobStatus(job.id);
            if (statusData && statusData.status === "cancel_requested") {
              console.log("");
              console.log("--> Cancellation requested from dashboard. Aborting run...");
              localCancelled = true;
              stopCurrentK6Process();
              clearInterval(cancelCheckInterval);
            }
          } catch (err) {
            // Ignore status polling errors
          }
        }, 2000);

        try {
          const { scriptPath, summaryPath, logsPath } = await createK6Script(job);

          const runResult = await runK6(scriptPath, job, logsPath);

          if (cancelCheckInterval) clearInterval(cancelCheckInterval);

          let summary = null;
          if (await fs.pathExists(summaryPath)) {
            summary = await fs.readJson(summaryPath);
          }

          await uploadLogs(job.id, runResult.logs);

          await uploadResult(job.id, {
            status: "completed",
            summary,
            logs: runResult.logs
          });

          console.log("");
          console.log("Test completed successfully.");
          console.log("");
          console.log("Results uploaded to your K6 Lab dashboard.");
          console.log("Open the dashboard to view the full performance report.");
          console.log("");
          console.log("Waiting for jobs...");
          console.log("");
        } catch (err) {
          if (cancelCheckInterval) clearInterval(cancelCheckInterval);

          if (localCancelled) {
            await cancelJob(job.id, "Test cancelled by user from dashboard");
            console.log("");
            console.log("Test execution successfully cancelled.");
            console.log("");
          } else {
            // Check if backend cancellation requested in middle of execution
            try {
              const currentStatus = await getJobStatus(job.id);
              if (currentStatus && (currentStatus.status === "cancel_requested" || currentStatus.status === "cancelled")) {
                await cancelJob(job.id, "Test cancelled by user from dashboard");
                console.log("");
                console.log("Test execution successfully cancelled.");
                console.log("");
                console.log("Waiting for jobs...");
                console.log("");
                continue;
              }
            } catch (statusErr) {
              // fallback to failure
            }

            await failJob(job.id, err.message);

            console.log("");
            console.log("Test failed.");
            console.log("");
            console.log("Reason:");
            console.log(err.message);
            console.log("");
            console.log("The failure details were uploaded to your dashboard.");
            console.log("Please check your local API and try again.");
            console.log("");
          }

          console.log("Waiting for jobs...");
          console.log("");
        }
      } catch (err) {
        console.error("Agent connection error:", err.message);
        await sleep(5000);
      }
    }
  } catch (err) {
    console.error("");
    console.error(err.message);
    console.error("");
    console.error("Fix the issue and run:");
    console.error("");
    console.error("k6lab-agent start");
    console.error("");
    process.exit(1);
  }
}
