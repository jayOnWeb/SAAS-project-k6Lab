import fs from "fs/promises";
import os from "os";
import path from "path";

const configDir = path.join(os.homedir(), ".k6lab");
const configPath = path.join(configDir, "config.json");

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function saveConfig(config) {
  // Create ~/.k6lab directory with restrictive permissions (0700: owner rwx only)
  await fs.mkdir(configDir, { recursive: true, mode: 0o700 });
  // Write config.json with restrictive permissions (0600: owner rw only)
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), { encoding: "utf8", mode: 0o600 });
}

export async function getConfig() {
  const exists = await pathExists(configPath);

  if (!exists) {
    throw new Error("Agent is not logged in. Run: k6lab-agent login <token>");
  }

  const raw = await fs.readFile(configPath, "utf8");
  return JSON.parse(raw);
}

export async function clearConfig() {
  await fs.rm(configPath, { recursive: true, force: true });
}

export function getK6LabDir() {
  return configDir;
}
