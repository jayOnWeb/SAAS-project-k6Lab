import { getConfig } from "../services/configStore.js";
import { VERSION } from "../utils/version.js";
import { drawBanner, drawCard, logWarn, colors, symbols } from "../utils/ui.js";

export async function status() {
  try {
    const config = await getConfig();
    drawBanner(VERSION, "ONLINE");
    
    console.log("");
    drawCard(
      `${symbols.pulse} AGENT CONFIGURATION & STATUS`,
      [
        { label: "Status", value: "CONNECTED & VERIFIED", color: colors.brightGreen },
        { label: "Agent Name", value: config.agentName, color: colors.brightCyan },
        { label: "Agent ID", value: config.agentId, color: colors.gray },
        { label: "Dashboard", value: "https://k6lab.duckdns.org", color: colors.brightCyan },
        { label: "API Endpoint", value: config.apiUrl, color: colors.brightWhite },
        "---",
        { label: "Command", value: "k6lab-agent start (to listen for test jobs)", color: colors.brightYellow }
      ],
      colors.cyan
    );
    console.log("");
  } catch (err) {
    drawBanner(VERSION, "OFFLINE");
    console.log("");
    logWarn("K6 Lab Agent Status: DISCONNECTED / NOT LOGGED IN");
    console.log(`${colors.gray}Get your token from: ${colors.brightCyan}https://k6lab.duckdns.org${colors.reset}`);
    console.log(`${colors.gray}Run: ${colors.brightYellow}k6lab-agent login <token>${colors.gray} to connect your local environment.${colors.reset}`);
    console.log("");
  }
}


