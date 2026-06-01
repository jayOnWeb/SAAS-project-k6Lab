import axios from "axios";
import { saveConfig } from "../services/configStore.js";

export async function login(token) {
  const apiUrl = process.env.K6LAB_API_URL || "http://localhost:8000";

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
    console.log("K6 Lab Agent connected successfully.");
    console.log("");
    console.log(`Agent: ${res.data.agent.name}`);
    console.log(`API: ${apiUrl}`);
    console.log("");
    console.log("Now start the agent:");
    console.log("");
    console.log("k6lab-agent start");
    console.log("");
  } catch (err) {
    console.error("");
    console.error("Agent login failed.");
    console.error("Reason: invalid token or backend not reachable.");
    if (err.response?.data?.error) {
      console.error(`Details: ${err.response.data.error}`);
    }
    console.error("");
    process.exit(1);
  }
}
