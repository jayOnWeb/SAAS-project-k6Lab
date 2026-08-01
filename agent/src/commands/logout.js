import { clearConfig } from "../services/configStore.js";
import { notifyLogout } from "../services/api.js";
import { logSuccess, logError } from "../utils/ui.js";

export async function logout() {
  try {
    await notifyLogout();
    await clearConfig();
    console.log("");
    logSuccess("Logged out successfully. Local agent configuration cleared.");
    console.log("");
  } catch (err) {
    console.log("");
    logError(`Logout action failed: ${err.message}`);
    console.log("");
  }
}


