import { clearConfig } from "../services/configStore.js";

export async function logout() {
  try {
    await clearConfig();
    console.log("");
    console.log("Logged out successfully. Local agent configuration wiped.");
    console.log("");
  } catch (err) {
    console.error("Logout action failed:", err.message);
  }
}
