<div align="center">

# ⚡ k6lab-agent

**High-Performance Local Load Testing Runner for the K6 Lab Platform**

[![npm version](https://img.shields.io/npm/v/k6lab-agent.svg?style=flat-square&color=cb3837)](https://www.npmjs.com/package/k6lab-agent)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717.svg?style=flat-square&logo=github)](https://github.com/jayOnWeb/SAAS-project-k6Lab/tree/main/agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org)
[![k6 Compatible](https://img.shields.io/badge/k6-compatible-7d64ff.svg?style=flat-square)](https://k6.io)

<p align="center">
  <a href="#-web-platform--dashboard">Web Platform</a> •
  <a href="https://github.com/jayOnWeb/SAAS-project-k6Lab/tree/main/agent">GitHub Repo</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-architecture--how-it-works">How It Works</a> •
  <a href="#-prerequisites">Prerequisites</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-cli-command-reference">CLI Reference</a> •
  <a href="#-troubleshooting--faq">Troubleshooting</a>
</p>

</div>

---

## 🌐 Web Platform & Dashboard

`k6lab-agent` is the official companion CLI for **K6 Lab**, the modern developer platform for API load and stress testing.

> 🚀 **Access the Web App:** **[https://k6lab.com](https://k6lab.com)** *(or your self-hosted deployment)*  
> Configure tests, manage target endpoints, view real-time latency histograms, and generate AI-powered performance diagnostics from our visual web cockpit.

---

## 💡 Why `k6lab-agent`?

When testing private microservices, staging environments, or local endpoints like `http://localhost:3000/api` and `http://127.0.0.1:8000/health`, cloud-only load testing platforms fail because they cannot reach inside your local network without risky firewall changes or complex tunneling.

**`k6lab-agent` solves this completely:**
1. **Runs Locally, Governed Globally**: You create and trigger tests from the sleek K6 Lab web dashboard.
2. **Zero Inbound Ports Required**: The agent securely polls for jobs and runs native `k6` binaries directly on your machine or private VPC.
3. **Real-time Live Telemetry**: Live stdout/stderr logs, response time percentiles (P90/P95/P99), and throughput metrics are streamed back to your web browser in real-time.
4. **Zero Secrets Leaked**: Private environment variables, database keys, and backend credentials never leave your local machine.

---

## 🏗️ Architecture & How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    K6 Lab Web Dashboard                     │
│               (https://k6lab.com / Web App)                │
│  - Configure Virtual Users (VUs) & Duration                 │
│  - Live latency histograms & AI telemetry analysis          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / WebSockets
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    K6 Lab API Server                        │
│  - Authenticates Agent Token & Queues Load Test Jobs        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Heartbeat & Long-Poll
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Your Local Machine                      │
│                                                             │
│   [k6lab-agent CLI]  <─── Picks Job                         │
│           │                                                 │
│           ▼ (Spawns native Go process)                      │
│      [k6 Engine] ───────► Tests: http://localhost:5000/...  │
│           │                                                 │
│           ▼ (Streams back live logs & latency metrics)      │
│   [Telemetry Sync] ─────► K6 Lab Dashboard                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- ⚡ **Native k6 Execution**: Spawns the official native `k6` Go binary for maximum concurrency with minimal CPU and memory overhead.
- 📡 **Real-time Log Streaming**: Pipes terminal logs and execution progress directly into your live web session.
- 🤖 **AI-Powered Diagnostics**: Non-technical friendly! Pairs with K6 Lab's Neural Performance Audit to translate complex TTFB, P95, and error rates into plain-English summaries.
- 🔒 **Zero-Trust Security**: No inbound ports, tunnels, or firewall modifications needed.
- 🔄 **Auto-Recovery & Heartbeat**: Automatically tracks agent health, reconnects gracefully on network hiccups, and handles graceful cancellation (`Ctrl+C`).

---

## 🛠️ Prerequisites

Before installing `k6lab-agent`, ensure you have the following installed on your machine:

### 1. Node.js (v16 or higher)
Check with: `node -v` (Download from [nodejs.org](https://nodejs.org/))

### 2. k6 Native Binary
`k6lab-agent` uses the official `k6` tool to execute stress tests. Install it for your OS:

* **macOS** (via Homebrew):
  ```bash
  brew install k6
  ```

* **Windows** (via Winget, Chocolatey, or Scoop):
  ```powershell
  winget install k6 --source winget
  # or
  choco install k6
  # or
  scoop install k6
  ```

* **Linux** (Debian / Ubuntu):
  ```bash
  sudo gpg -k
  sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5D53F5675C117B8
  echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
  sudo apt-get update
  sudo apt-get install k6
  ```

* **Docker / Manual Binary**: Download the standalone binary from [k6 Releases](https://github.com/grafana/k6/releases).

---

## 🚀 Quick Start (Step-by-Step)

### Step 1: Install `k6lab-agent` Globally
Install the package from npm:

```bash
npm install -g k6lab-agent
```

Verify installation:
```bash
k6lab-agent --version
```

---

### Step 2: Get Your Agent Token
1. Open the [K6 Lab Dashboard](https://k6lab.com).
2. Navigate to **Agent Settings** / **Connect Local Agent**.
3. Copy your unique **Agent Token**.

---

### Step 3: Connect & Authenticate
Authenticate your local agent using your token:

```bash
k6lab-agent login <YOUR_AGENT_TOKEN>
```

> **Using a Custom / Self-Hosted Backend?**  
> Pass the `--url` (or `-u`) flag:
> ```bash
> k6lab-agent login <YOUR_AGENT_TOKEN> --url https://api.yourdomain.com
> ```

---

### Step 4: Start the Runner Daemon
Start the agent to begin listening for tests triggered from the web interface:

```bash
k6lab-agent start
```

You will see the active cockpit banner:
```txt
┌────────────────────────────────────────────────────────────┐
│  ⚡ K6 LAB AGENT v1.0.4                        🟢 ONLINE    │
└────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│  📡 READY & WAITING FOR DASHBOARD JOBS                       │
├──────────────────────────────────────────────────────────────┤
│  Agent Name   : My Macbook Runner                            │
│  API Server   : https://k6lab.com                            │
│  Load Engine  : k6 v0.48.0 (native)                          │
│  Status       : LISTENING (POLLING 3s)                       │
│  Shortcut     : Press Ctrl+C to stop agent                   │
└──────────────────────────────────────────────────────────────┘
```

Now, whenever you click **"Run Test"** on the [K6 Lab Web Dashboard](https://k6lab.com), your local agent will automatically pick up the job, run the test locally, and stream telemetry back live! 🎉

---

## 📖 CLI Command Reference

| Command | Arguments / Options | Description |
| :--- | :--- | :--- |
| `k6lab-agent login <token>` | `[--url, -u <apiUrl>]` | Authenticate and save agent credentials. |
| `k6lab-agent start` | — | Start the worker daemon and listen for queued test runs. |
| `k6lab-agent status` | — | Display current connection, agent identity, and server info. |
| `k6lab-agent logout` | — | Disconnect agent and clear local stored credentials. |
| `k6lab-agent --version` | — | Print installed `k6lab-agent` version. |
| `k6lab-agent --help` | — | Show help and usage instructions. |

---

## ⚙️ Environment Variables

You can optionally override configuration using environment variables:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `K6LAB_API_URL` | `http://localhost:8000` | Fallback backend API URL if not specified during `login`. |

---

## 🔧 Troubleshooting & FAQ

### 1. `k6 engine is not installed or not in PATH`
**Solution**: Make sure you have installed `k6` using Homebrew, Chocolatey, or apt (see [Prerequisites](#-prerequisites)). Test by running `k6 version` in your terminal. If installed in a non-standard directory, ensure that directory is in your system's `PATH`.

### 2. `Invalid agent token or backend server is unreachable`
**Solution**:
- Double check that your token was copied correctly from the dashboard.
- If using a cloud backend or self-hosted server, make sure to pass `--url`:
  ```bash
  k6lab-agent login YOUR_TOKEN --url https://api.k6lab.com
  ```
- Ensure your machine has an active internet connection.

### 3. How do I test local APIs (`localhost:3000`)?
When creating a test on the [K6 Lab Dashboard](https://k6lab.com), simply input your local URL (e.g. `http://localhost:3000/api/users`). Because `k6lab-agent` executes `k6` directly on your machine, `localhost` resolves locally on your machine with zero networking issues.

### 4. How to stop or restart the agent?
Press `Ctrl + C` in the terminal running `k6lab-agent start`. The agent will gracefully stop any currently running tests and disconnect cleanly.

---

## 📄 License & Source Code

Distributed under the **MIT License**. See `LICENSE` for more information.  
Source Code: [https://github.com/jayOnWeb/SAAS-project-k6Lab/tree/main/agent](https://github.com/jayOnWeb/SAAS-project-k6Lab/tree/main/agent)

---

<div align="center">
  <sub>Built with ❤️ for developers and QA engineers by the <a href="https://k6lab.com">K6 Lab Team</a> • <a href="https://github.com/jayOnWeb/SAAS-project-k6Lab/tree/main/agent">GitHub Repository</a></sub>
</div>


