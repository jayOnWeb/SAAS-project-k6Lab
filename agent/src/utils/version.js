import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, "../../package.json");

let version = "1.0.5";
try {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  version = pkg.version || version;
} catch {
  // fallback
}

export const VERSION = version;
