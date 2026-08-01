import { getConfig } from "../services/configStore.js";
import { drawBanner, drawCard, logWarn, colors, symbols } from "../utils/ui.js";

export async function status() {
  try {
    const config = await getConfig();
    drawBanner("1.0.3", "ONLINE");
    
    console.log("");
    drawCard(
      `${symbols.pulse} AGENT CONFIGURATION & STATUS`,
      [
        { label: "Status", value: "CONNECTED & VERIFIED", color: colors.brightGreen },
        { label: "Agent Name", value: config.agentName, color: colors.brightCyan },
        { label: "Agent ID", value: config.agentId, color: colors.gray },
        { label: "API Endpoint", value: config.apiUrl, color: colors.brightWhite },
        "---",
        { label: "Command", value: "k6lab-agent start (to listen for test jobs)", color: colors.brightYellow }
      ],
      colors.cyan
    );
    console.log("");
  } catch (err) {
    drawBanner("1.0.3", "OFFLINE");
    console.log("");
    logWarn("K6 Lab Agent Status: DISCONNECTED / NOT LOGGED IN");
    console.log(`${colors.gray}Run: ${colors.brightYellow}k6lab-agent login <token>${colors.gray} to connect your local environment.${colors.reset}`);
    console.log("");
  }
}

