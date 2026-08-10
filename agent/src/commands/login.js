import axios from "axios";
import { saveConfig } from "../services/configStore.js";
import { VERSION } from "../utils/version.js";
import { drawBanner, drawCard, logSuccess, logError, colors, symbols } from "../utils/ui.js";

export async function login(token, options = {}) {
  const rawUrl = options.url || process.env.K6LAB_API_URL || "http://localhost:8000";
  const apiUrl = rawUrl.trim().replace(/\/+$/, "");

  drawBanner(VERSION, "CONNECTING");

  try {
    const res = await axios.post(
      `${apiUrl}/api/agent/verify-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    await saveConfig({
      apiUrl,
      agentToken: token,
      agentId: res.data.agent.id,
      agentName: res.data.agent.name
    });

    console.log("");
    logSuccess("K6 Lab Agent connected and authenticated successfully!");
    console.log("");

    drawCard(
      `${symbols.check} AGENT ACCOUNT DETAILS`,
      [
        { label: "Agent Name", value: res.data.agent.name, color: colors.brightCyan },
        { label: "Agent ID", value: res.data.agent.id, color: colors.gray },
        { label: "API Server", value: apiUrl, color: colors.brightWhite },
        "---",
        { label: "Next Step", value: "Run 'k6lab-agent start' to launch local runner", color: colors.brightYellow }
      ],
      colors.green
    );
    console.log("");
  } catch (err) {
    console.log("");
    logError("Agent login failed.");
    logError("Reason: Invalid agent token or backend server is unreachable.");
    if (err.response?.data?.error) {
      console.log(`${colors.gray}Details: ${err.response.data.error}${colors.reset}`);
    } else if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      console.log(`${colors.gray}Details: Could not connect to API server at ${apiUrl}${colors.reset}`);
    }
    console.log("");
    process.exit(1);
  }
}


