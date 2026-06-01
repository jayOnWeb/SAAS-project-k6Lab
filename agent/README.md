# 🚀 k6lab-agent

> The high-performance, local load-testing execution runner for the **K6 Lab** platform.

`k6lab-agent` is a lightweight, globally linked command-line utility that bridges your local environment with the K6 Lab dashboard. By utilizing this local agent, K6 Lab runs in **Agent-Only Mode**, running heavy stress tests directly on your laptop with zero-overhead server processing, while synchronizing live telemetry and logs in real-time.

---

## 📦 Features

* **Local k6 Execution**: Spawns native, lightning-fast `k6` binaries directly on your machine.
* **Real-Time Log Streaming**: Streams terminal output (`stdout`/`stderr`) live to your K6 Lab dashboard cockpit.
* **Atomically Queued Runs**: Automatically polls your MongoDB backend queues and executes runs chronologically.
* **Heartbeat Synchronizer**: Periodically signals connection status (online/offline) to prevent diagnostic dropouts.
* **Zero Secrets Exposure**: Kept completely safe—no database credentials or private environment variables are stored in the agent.

---

## 🤖 AI-Powered Telemetry Insights (Non-Tech Friendly!)

Load-testing metrics (like TTFB, P90 latency, TLS handshakes, and raw network payloads) can be extremely intimidating, especially if you are a **non-technical developer**, product manager, or designer. K6 Lab solves this completely!

Our integrated **Neural Performance Audit** translates complex graphs and response breakdowns into a friendly, plain-English summary:
* **Human-Readable Audits**: Explains exactly how your target API behaved using simple, practical terms.
* **Direct Encouragement**: Celebrates and confirms when your local server handled the simulated load beautifully with zero errors and fast speeds.
* **Practical Roadmaps**: Gives you a clear recommendation on how and when to scale up your test settings (e.g. testing with 20 VUs for 30 seconds) to safely discover your endpoint's real stress limits!

---

## 🛠️ Installation

Ensure you have [Node.js](https://nodejs.org/) (v16+) and the [k6 load testing tool](https://k6.io/docs/get-started/installation/) installed locally.

### 1. Install k6 (Native Binary)
* **macOS** (via Homebrew):
  ```bash
  brew install k6
  ```
* **Windows** (via Chocolatey):
  ```powershell
  choco install k6
  ```
* **Linux** (via Debian/Ubuntu):
  ```bash
  sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5D53F5675C117B8
  echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
  sudo apt-get update
  sudo apt-get install k6
  ```

### 2. Install the Agent CLI Globally
Install the package directly from the public npm registry:
```bash
npm install -g k6lab-agent
```

---

## 🚀 Getting Started

To link and run your agent, follow these quick steps:

### Step 1: Login with your API Token
Retrieve your unique agent login token from your K6 Lab dashboard panel, and authenticate:
```bash
k6lab-agent login k6lab_agent_your_unique_dashboard_token
```

### Step 2: Start the Agent runner
Start the runner loop. The agent will connect, start emitting 5-second heartbeats to display as "Online" on your dashboard, and listen for new stress tests:
```bash
k6lab-agent start
```

*Leave this terminal window open. As soon as you click **"Dispatch Load Test Run"** on the K6 Lab configurator, the agent will instantly catch the job, execute k6, and feed live console logs back to your screen!*

---

## 💻 CLI Command Reference

| Command | Description |
| :--- | :--- |
| `k6lab-agent login <token>` | Saves your API credentials and registers your Mac/PC with the backend server. |
| `k6lab-agent start` | Connects the active agent, initiates heartbeats, and polls for pending dashboard runs. |
| `k6lab-agent status` | Displays the current connection and login configurations. |
| `k6lab-agent logout` | Revokes the current agent token and clears credentials from your machine. |

---

## 📂 Configuration Storage

The agent securely stores local configuration parameters inside a hidden directory in your user home folder:
* **Storage Location**: `~/.k6lab/config.json`
* **Contents**:
  ```json
  {
    "token": "k6lab_agent_your_token_hash",
    "apiUrl": "http://localhost:8000/api"
  }
  ```

---

## 🔐 Security & Privacy

* **Strict Encryption**: Tokens are cryptographically matched on the Mongoose backend using one-way SHA-256 hashes.
* **Target URLs**: All network traffic generated during stress runs goes directly from your local machine to the target URL. 
* **Self-Contained**: The agent only reads the dynamically generated temporary k6 test scripts in `~/.k6lab/jobs/` and has no access to other filesystem paths.
