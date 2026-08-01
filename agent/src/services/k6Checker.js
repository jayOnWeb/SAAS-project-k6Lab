import { spawn } from "child_process";

export function checkK6Installed() {
  return new Promise((resolve, reject) => {
    const child = spawn("k6", ["version"], {
      shell: false
    });

    let output = "";
    if (child.stdout) {
      child.stdout.on("data", (data) => {
        output += data.toString();
      });
    }

    child.on("error", () => {
      reject(
        new Error(
          "k6 is not installed. Please install k6 first, then run the agent again."
        )
      );
    });

    child.on("close", (code) => {
      if (code === 0) {
        const match = output.trim().match(/k6\s+(v[\d.]+)/i) || output.trim().match(/(v[\d.]+)/i);
        const versionStr = match ? match[1] : output.trim().split("\n")[0] || "Installed";
        resolve(versionStr);
      } else {
        reject(new Error("k6 is installed but not working correctly."));
      }
    });
  });
}
