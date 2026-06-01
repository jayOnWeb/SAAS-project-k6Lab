import { spawn } from "child_process";

export function checkK6Installed() {
  return new Promise((resolve, reject) => {
    const child = spawn("k6", ["version"], {
      shell: false
    });

    child.on("error", () => {
      reject(
        new Error(
          "k6 is not installed. Please install k6 first, then run the agent again."
        )
      );
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error("k6 is installed but not working correctly."));
      }
    });
  });
}
