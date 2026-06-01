import { getConfig } from "../services/configStore.js";

export async function status() {
  try {
    const config = await getConfig();
    console.log("");
    console.log("K6 Lab Agent Status: Connected");
    console.log("------------------------------");
    console.log(`Agent Name:  ${config.agentName}`);
    console.log(`Agent ID:    ${config.agentId}`);
    console.log(`API URL:     ${config.apiUrl}`);
    console.log("");
  } catch (err) {
    console.log("");
    console.log("K6 Lab Agent Status: Disconnected / Not Logged In");
    console.log("Run: k6lab-agent login <token> to connect your local environment.");
    console.log("");
  }
}
