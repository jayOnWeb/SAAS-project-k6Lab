import fs from "fs-extra";
import os from "os";
import path from "path";

const configDir = path.join(os.homedir(), ".k6lab");
const configPath = path.join(configDir, "config.json");

export async function saveConfig(config) {
  await fs.ensureDir(configDir);
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export async function getConfig() {
  const exists = await fs.pathExists(configPath);

  if (!exists) {
    throw new Error("Agent is not logged in. Run: k6lab-agent login <token>");
  }

  return fs.readJson(configPath);
}

export async function clearConfig() {
  await fs.remove(configPath);
}

export function getK6LabDir() {
  return configDir;
}
