# K6 Lab Local Agent — Complete Instruction Guide

This document explains the **final Agent Mode flow** for K6 Lab in very detailed, step-by-step form.

This version assumes only one product mode:

```txt
Agent Mode only
```

That means:

```txt
The user creates a test from your web dashboard.
The backend stores that test as a job.
The local agent running on the user's laptop picks the job.
The local agent runs k6 on the user's laptop.
The result is uploaded back to your backend.
The user sees the final result in the frontend dashboard.
```

There is no Cloud Run mode in this document.

---

# 1. Product idea in one line

K6 Lab is a developer tool where users can create API load tests from a web dashboard and run those tests locally on their own machine using a small CLI agent.

The actual load test runs on the user's laptop, not on your server.

This is important because users want to test local APIs like:

```txt
http://localhost:5000/api/users
http://localhost:3000/api/login
http://127.0.0.1:8000/api/products
```

If your cloud backend tried to test these URLs, `localhost` would mean your server, not the user's laptop.

So the local agent solves this.

---

# 2. Main mental model

Think of your system like this:

```txt
Frontend Dashboard = User interface
Backend Server = Manager
Database = Job storage
Local Agent = Worker on user's laptop
k6 = Actual load testing engine
```

Restaurant analogy:

```txt
User places order from frontend.
Backend writes the order.
Agent checks the order list.
Agent cooks the order by running k6.
Agent sends the final dish/result back.
Frontend shows the final report.
```

In app terms:

```txt
User creates test
↓
Backend saves job
↓
Agent polls backend
↓
Agent receives job
↓
Agent runs k6 locally
↓
Agent uploads summary
↓
Dashboard shows result
```

---

# 3. Final user story

Imagine a user named Jay.

Jay has a backend project running locally:

```txt
http://localhost:5000
```

Jay wants to test this endpoint:

```txt
http://localhost:5000/api/users
```

Jay opens your website:

```txt
https://k6lab.com
```

Jay creates an account and logs in.

After login, K6 Lab does **not** immediately show the test creation form.

Instead, K6 Lab first checks whether Jay has a connected local agent.

If no agent is connected, K6 Lab shows an onboarding screen:

```txt
To test your localhost endpoints, connect your local K6 Lab Agent first.
```

Jay follows the setup steps, runs terminal commands, starts the agent, then comes back to the dashboard.

Once the agent is online, the dashboard unlocks the test form.

Jay enters:

```txt
URL: http://localhost:5000/api/users
Method: GET
VUs: 10
Duration: 30s
Expected Status: 200
Max Response Time: 1000ms
```

Jay clicks:

```txt
Start Test
```

The backend creates a queued job.

The agent running in Jay's terminal picks the job automatically.

The terminal says:

```txt
New test received.
Running k6 locally.
Please monitor progress in your dashboard.
```

The dashboard says:

```txt
Test running...
Please wait.
```

When k6 finishes, the agent uploads the result to the backend.

The terminal says:

```txt
Test completed successfully.
Results uploaded.
Check your dashboard for the full report.
```

Jay opens the dashboard and sees a beautiful result report.

Later, AI suggestions will also appear on this result page.

---

# 4. Why the agent is required before showing test form

The user's localhost API exists on the user's laptop.

Your cloud backend cannot directly call:

```txt
http://localhost:5000
```

on the user's laptop.

If your backend tries to call this URL, then:

```txt
localhost = your backend server
```

not the user's laptop.

Therefore, the first-time user flow should be:

```txt
Signup/Login
↓
Connect local agent
↓
Agent online
↓
Create test
```

Do **not** make the first-time user create a test before connecting an agent.

That creates confusion.

Correct UX:

```txt
No active agent = show setup screen
Active agent = show test form
```

---

# 5. Final complete flow overview

```txt
1. User signs up or logs in.
2. Frontend asks backend: does this user have an active agent?
3. If no active agent, frontend shows setup instructions.
4. User clicks "Create Agent Token".
5. Backend creates an agent and returns a one-time token.
6. Frontend displays terminal commands.
7. User runs commands in terminal.
8. Agent logs in using token and stores token locally.
9. User starts agent.
10. Agent sends heartbeat to backend.
11. Backend marks agent online.
12. Frontend detects agent online.
13. Frontend unlocks the test form.
14. User enters endpoint, method, VUs, duration, headers/body, etc.
15. User clicks "Start Test".
16. Backend validates test config.
17. Backend creates a queued job.
18. Agent polls backend and receives the job.
19. Backend marks job as running.
20. Agent creates a temporary k6 script locally.
21. Agent runs k6 locally using child_process.spawn().
22. Agent sends running logs/status to backend.
23. Frontend shows running status.
24. k6 finishes and writes summary.json.
25. Agent reads summary.json.
26. Agent uploads summary and logs to backend.
27. Backend marks job as completed or failed.
28. Frontend shows beautiful result dashboard.
29. Terminal only tells the user to check dashboard.
```

---

# 6. High-level architecture

```txt
React Frontend
   ↓
Express Backend API
   ↓
Database
   ↑
Local Agent on user's laptop
   ↓
k6 CLI
   ↓
User's local API
```

More detailed:

```txt
┌──────────────────────────────┐
│        React Frontend         │
│  - Signup/login               │
│  - Agent setup screen         │
│  - Test form                  │
│  - Result dashboard           │
└───────────────┬──────────────┘
                │ HTTP API
                ↓
┌──────────────────────────────┐
│       Express Backend         │
│  - User auth                  │
│  - Agent token generation     │
│  - Agent heartbeat            │
│  - Test job creation          │
│  - Job status/result APIs     │
└───────────────┬──────────────┘
                │ stores data
                ↓
┌──────────────────────────────┐
│          Database             │
│  - Users                      │
│  - Agents                     │
│  - Test jobs                  │
│  - Results                    │
└───────────────▲──────────────┘
                │ polling
                │ result upload
                │ heartbeat
┌───────────────┴──────────────┐
│     K6 Lab Local Agent        │
│  - Runs on user's laptop      │
│  - Polls backend              │
│  - Creates temp k6 files      │
│  - Runs k6 locally            │
│  - Uploads result             │
└───────────────┬──────────────┘
                │ local process
                ↓
┌──────────────────────────────┐
│             k6                │
│  - Sends requests to          │
│    localhost/project API      │
└──────────────────────────────┘
```

---

# 7. Responsibility of each part

| Part | Responsibility |
|---|---|
| Frontend | Shows setup, test form, status, final dashboard |
| Backend | Auth, agent registration, job creation, result storage |
| Database | Stores users, agents, jobs, results, logs |
| Agent | Polls jobs, runs k6 locally, uploads result |
| k6 | Performs actual load test |
| User terminal | Shows agent connection/running messages only |

---

# 8. Important UX principle

The terminal should not become the main report UI.

The terminal should only show simple status messages like:

```txt
Agent connected.
Waiting for jobs.
New test received.
Running k6 locally.
Test completed.
Results uploaded.
Check dashboard.
```

The frontend dashboard should show the actual result:

```txt
Total requests
Average response time
p95 response time
Failed request rate
Checks passed
Checks failed
Timeline
Logs
AI suggestions later
```

Why?

Because your product value is the dashboard.

The terminal is only a helper.

---

# 9. First-time user onboarding flow

## 9.1 User signs up

User enters:

```txt
Name
Email
Password
```

Frontend calls:

```txt
POST /api/auth/register
```

Backend creates user.

After successful login, user is redirected to:

```txt
/dashboard
```

---

## 9.2 Dashboard checks agent status

Frontend immediately calls:

```txt
GET /api/agents/me
```

If user has no agent, backend response:

```json
{
  "success": true,
  "hasAgent": false,
  "activeAgent": null,
  "agents": [],
  "setupRequired": true,
  "message": "No local agent connected."
}
```

Frontend shows:

```txt
Connect your local agent

K6 Lab runs tests from your own laptop so localhost URLs work correctly.

Step 1: Install k6
Step 2: Install K6 Lab Agent
Step 3: Login agent using your token
Step 4: Start agent
```

At this stage, do **not** show the test creation form.

---

## 9.3 User clicks "Create Agent Token"

Frontend calls:

```txt
POST /api/agents/register
```

Request:

```json
{
  "name": "My Laptop"
}
```

For MVP, you can auto-generate the agent name if user does not enter it:

```txt
My Laptop
```

or:

```txt
Jay's Device
```

Backend response:

```json
{
  "success": true,
  "agent": {
    "id": "agent_123",
    "name": "My Laptop",
    "status": "offline"
  },
  "agentToken": "k6lab_agent_abc123",
  "message": "Agent created. Copy this token now.",
  "commands": {
    "common": [
      "npm install -g k6lab-agent",
      "k6lab-agent login k6lab_agent_abc123",
      "k6lab-agent start"
    ]
  }
}
```

Important:

```txt
Show the raw agent token only once.
Store only token hash in DB.
```

---

## 9.4 Frontend shows terminal commands

Dashboard UI should show:

```txt
Run these commands in your terminal:
```

For macOS:

```bash
brew install k6
npm install -g k6lab-agent
k6lab-agent login k6lab_agent_abc123
k6lab-agent start
```

For Windows:

```bash
winget install k6 --source winget
npm install -g k6lab-agent
k6lab-agent login k6lab_agent_abc123
k6lab-agent start
```

For Linux:

```bash
# Install k6 according to your Linux distribution
npm install -g k6lab-agent
k6lab-agent login k6lab_agent_abc123
k6lab-agent start
```

Keep a button:

```txt
Copy commands
```

Also show:

```txt
Keep the terminal open while tests are running.
```

---

# 10. Terminal command logic

The website cannot directly run commands on the user's laptop.

Browser security does not allow your frontend to open the user's terminal and run commands automatically.

So the flow is:

```txt
Frontend shows commands
↓
User copies commands
↓
User pastes commands in terminal
↓
Your CLI agent runs on their laptop
```

---

## 10.1 Command 1: install agent

```bash
npm install -g k6lab-agent
```

This installs your CLI package globally.

After this, user's terminal understands:

```bash
k6lab-agent
```

This works because your `agent/package.json` has a `bin` field:

```json
{
  "name": "k6lab-agent",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "k6lab-agent": "./src/index.js"
  }
}
```

---

## 10.2 Command 2: login agent

```bash
k6lab-agent login k6lab_agent_abc123
```

What happens internally:

```txt
1. CLI receives token.
2. CLI sends token to backend for verification.
3. Backend checks token hash.
4. If token is valid, backend returns agent info.
5. CLI saves token locally in ~/.k6lab/config.json.
6. CLI prints success message.
```

Terminal output should be:

```txt
K6 Lab Agent connected successfully.

Agent: My Laptop
API: https://api.k6lab.com

Now start the agent:

k6lab-agent start
```

---

## 10.3 Command 3: start agent

```bash
k6lab-agent start
```

What happens internally:

```txt
1. CLI reads token from ~/.k6lab/config.json.
2. CLI checks if k6 is installed.
3. CLI sends heartbeat to backend.
4. Backend marks agent online.
5. CLI starts polling for jobs.
6. CLI waits until user creates a test from dashboard.
```

Terminal output should be:

```txt
Starting K6 Lab Agent...

k6 is installed and ready.
Connected to K6 Lab dashboard.
Agent is online.

You can now create a test from your dashboard.
Waiting for jobs...
```

---

# 11. Agent status and dashboard unlock

Once the agent starts, it sends heartbeat:

```txt
POST /api/agents/heartbeat
```

Backend updates:

```js
agent.status = "online";
agent.lastSeenAt = new Date();
```

Frontend keeps polling:

```txt
GET /api/agents/me
```

When agent is online, backend response:

```json
{
  "success": true,
  "hasAgent": true,
  "activeAgent": {
    "id": "agent_123",
    "name": "My Laptop",
    "status": "online",
    "lastSeenAt": "2026-06-01T10:00:00.000Z"
  },
  "setupRequired": false
}
```

Frontend shows:

```txt
Agent connected ✅

You can now create your first load test.
```

Now show the test form.

---

# 12. Test creation form

Because this is Agent Mode only, user should not select "mode".

For MVP, user also does not need to select an agent if they have only one online agent.

The backend can automatically use the active online agent.

## 12.1 Must fields

These fields are required.

### Test name

Used for dashboard/history.

Example:

```txt
Login API Load Test
```

Field:

```js
name: "Login API Load Test"
```

### URL / Endpoint

Example:

```txt
http://localhost:5000/api/users
```

Field:

```js
url: "http://localhost:5000/api/users"
```

### HTTP method

Allowed:

```txt
GET
POST
PUT
PATCH
DELETE
```

Field:

```js
method: "GET"
```

### VUs

Virtual users.

Example:

```txt
10
```

Field:

```js
vus: 10
```

### Duration

Example:

```txt
30s
1m
5m
```

Field:

```js
duration: "30s"
```

---

## 12.2 Optional fields

### Headers

Example:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer token_here"
}
```

Field:

```js
headers: {
  "Content-Type": "application/json"
}
```

### Body

Used mostly for POST/PUT/PATCH.

Example:

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

Field:

```js
body: {
  "email": "test@example.com",
  "password": "123456"
}
```

### Expected status code

Default:

```txt
200
```

Example:

```js
expectedStatus: 200
```

For create APIs:

```js
expectedStatus: 201
```

### Max response time

Default:

```txt
1000ms
```

Field:

```js
maxResponseTimeMs: 1000
```

### Sleep between requests

Default:

```txt
1 second
```

Field:

```js
sleepSeconds: 1
```

### Request timeout

Default:

```txt
30s
```

Field:

```js
timeout: "30s"
```

### Description

Optional note for the test.

```js
description: "Testing local login API before deployment"
```

### Tags

Optional labels for filtering history.

```js
tags: ["auth", "local", "login"]
```

---

## 12.3 Recommended MVP test config object

```js
{
  "name": "Users API Test",
  "url": "http://localhost:5000/api/users",
  "method": "GET",
  "vus": 10,
  "duration": "30s",
  "headers": {},
  "body": null,
  "expectedStatus": 200,
  "maxResponseTimeMs": 1000,
  "sleepSeconds": 1,
  "timeout": "30s"
}
```

POST example:

```js
{
  "name": "Login API Test",
  "url": "http://localhost:5000/api/login",
  "method": "POST",
  "vus": 20,
  "duration": "1m",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "test@example.com",
    "password": "123456"
  },
  "expectedStatus": 200,
  "maxResponseTimeMs": 1000,
  "sleepSeconds": 1,
  "timeout": "30s"
}
```

---

# 13. What happens when user clicks Start Test

Frontend calls:

```txt
POST /api/tests
```

Request:

```json
{
  "name": "Users API Test",
  "url": "http://localhost:5000/api/users",
  "method": "GET",
  "vus": 10,
  "duration": "30s",
  "headers": {},
  "body": null,
  "expectedStatus": 200,
  "maxResponseTimeMs": 1000,
  "sleepSeconds": 1,
  "timeout": "30s"
}
```

Backend steps:

```txt
1. Verify user JWT.
2. Find user's active online agent.
3. If no active agent, return NO_ACTIVE_AGENT.
4. Validate test config.
5. Create job in DB with status = queued.
6. Return jobId and queued status to frontend.
```

---

## 13.1 If no active agent

Response:

```json
{
  "success": false,
  "code": "NO_ACTIVE_AGENT",
  "message": "Your local agent is not connected. Run k6lab-agent start in your terminal.",
  "setupRequired": true
}
```

Frontend should show:

```txt
Agent offline

Run this command in terminal:

k6lab-agent start
```

---

## 13.2 If active agent exists

Backend creates job:

```js
{
  "_id": "job_123",
  "userId": "user_123",
  "agentId": "agent_123",
  "status": "queued",
  "config": {
    "name": "Users API Test",
    "url": "http://localhost:5000/api/users",
    "method": "GET",
    "vus": 10,
    "duration": "30s"
  },
  "result": null,
  "logs": "",
  "error": null,
  "createdAt": "..."
}
```

Response:

```json
{
  "success": true,
  "message": "Test queued successfully. Your local agent will start it automatically.",
  "job": {
    "id": "job_123",
    "status": "queued",
    "name": "Users API Test",
    "url": "http://localhost:5000/api/users",
    "method": "GET",
    "vus": 10,
    "duration": "30s",
    "createdAt": "2026-06-01T10:00:00.000Z"
  }
}
```

Frontend redirects to:

```txt
/tests/job_123
```

or opens a result/status page.

Dashboard shows:

```txt
Test queued
Waiting for local agent...
```

---

# 14. Agent receives the job

The running agent is polling:

```txt
GET /api/agents/jobs/next
```

When job is available, backend returns:

```json
{
  "success": true,
  "job": {
    "id": "job_123",
    "name": "Users API Test",
    "config": {
      "url": "http://localhost:5000/api/users",
      "method": "GET",
      "vus": 10,
      "duration": "30s",
      "headers": {},
      "body": null,
      "expectedStatus": 200,
      "maxResponseTimeMs": 1000,
      "sleepSeconds": 1,
      "timeout": "30s"
    }
  }
}
```

Backend should atomically update:

```txt
queued → running
startedAt = current time
```

This prevents the same job from being picked twice.

---

## 14.1 Terminal output when job is received

Agent terminal should say:

```txt
New test received: Users API Test

GET http://localhost:5000/api/users
VUs: 10
Duration: 30s

Running k6 locally...
Please keep this terminal open.
You can monitor progress in your K6 Lab dashboard.
```

Do not print huge result summary in terminal.

---

# 15. Dashboard while test is running

Frontend polls:

```txt
GET /api/tests/:jobId
```

every 2-3 seconds.

Running response:

```json
{
  "success": true,
  "job": {
    "id": "job_123",
    "status": "running",
    "startedAt": "2026-06-01T10:00:05.000Z",
    "message": "Your local agent is running this test.",
    "logsPreview": "Running k6 locally..."
  }
}
```

Dashboard should show:

```txt
Test running...
Your local agent is running k6 on your machine.
Please keep the agent terminal open.
```

Optional:

```txt
Elapsed time
Configured duration
Endpoint
VUs
Method
Agent status
```

---

# 16. Local file strategy

## 16.1 Important decision

Do **not** automatically create a `k6` folder inside the user's project root by default.

Use a hidden global agent directory instead:

```txt
~/.k6lab/
```

Why?

The agent may be started from anywhere:

```bash
cd Desktop
k6lab-agent start
```

or:

```bash
cd Downloads
k6lab-agent start
```

or:

```bash
cd my-project
k6lab-agent start
```

If you create files in the current directory, files may appear in the wrong place.

Better:

```txt
User should not manage k6 files manually.
Agent should manage all temporary files automatically.
Dashboard should manage history and results.
```

---

## 16.2 Recommended local folder structure

```txt
~/.k6lab/
  config.json
  jobs/
    job_123/
      script.js
      summary.json
      logs.txt
      metadata.json
    job_456/
      script.js
      summary.json
      logs.txt
      metadata.json
```

### config.json

Stores local agent config:

```json
{
  "apiUrl": "https://api.k6lab.com",
  "agentToken": "k6lab_agent_abc123"
}
```

### script.js

Temporary generated k6 script for this job.

### summary.json

k6 final summary.

### logs.txt

Captured k6 stdout/stderr.

### metadata.json

Optional metadata:

```json
{
  "jobId": "job_123",
  "testName": "Users API Test",
  "createdAt": "2026-06-01T10:00:00.000Z"
}
```

---

## 16.3 Cleanup strategy

After result upload, agent can clean old local job files.

Recommended MVP:

```txt
Keep last 10 job folders.
Delete older folders.
```

or:

```txt
Delete job folders older than 7 days.
```

Do not delete immediately while debugging MVP. Keep them for troubleshooting.

Recommended development behavior:

```txt
Keep files locally for 7 days.
```

Recommended production behavior:

```txt
Keep last 10 jobs or 7 days, whichever is smaller.
```

---

## 16.4 Should there ever be a project-root folder?

Later optional feature:

```bash
k6lab-agent init
```

If user runs:

```bash
cd my-backend-project
k6lab-agent init
```

Then you can create:

```txt
my-backend-project/
  .k6lab/
    project.json
```

But this is optional and not needed for MVP.

For MVP:

```txt
Use ~/.k6lab/jobs/
Do not create project-root/k6 automatically.
```

---

# 17. Generate k6 script locally

The backend should send config, not code.

Good backend job:

```json
{
  "url": "http://localhost:5000/api/users",
  "method": "GET",
  "vus": 10,
  "duration": "30s"
}
```

Bad backend job:

```json
{
  "command": "k6 run script.js"
}
```

The agent receives config and generates the k6 script locally.

This is safer and easier to control.

---

## 17.1 Example generated script

```js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: Number(__ENV.K6LAB_VUS || 1),
  duration: __ENV.K6LAB_DURATION || "10s",
};

export default function () {
  const method = __ENV.K6LAB_METHOD || "GET";
  const url = __ENV.K6LAB_URL;

  const headers = JSON.parse(__ENV.K6LAB_HEADERS || "{}");
  const body = __ENV.K6LAB_BODY || null;

  const params = {
    headers,
    timeout: __ENV.K6LAB_TIMEOUT || "30s",
  };

  const res = http.request(method, url, body, params);

  check(res, {
    "status is expected": (r) => {
      const expectedStatus = Number(__ENV.K6LAB_EXPECTED_STATUS || 200);
      return r.status === expectedStatus;
    },
    "response time is acceptable": (r) => {
      const maxMs = Number(__ENV.K6LAB_MAX_RESPONSE_TIME_MS || 1000);
      return r.timings.duration < maxMs;
    },
  });

  const sleepSeconds = Number(__ENV.K6LAB_SLEEP_SECONDS || 1);
  sleep(sleepSeconds);
}

export function handleSummary(data) {
  return {
    [__ENV.K6LAB_SUMMARY_PATH]: JSON.stringify(data),
  };
}
```

---

# 18. Running k6 from agent

Use Node.js `child_process.spawn()`.

Good:

```js
spawn("k6", ["run", scriptPath], {
  shell: false,
  env: {
    ...process.env,
    K6LAB_URL: job.config.url,
    K6LAB_METHOD: job.config.method,
    K6LAB_VUS: String(job.config.vus),
    K6LAB_DURATION: job.config.duration
  }
});
```

Bad:

```js
exec(`k6 run ${scriptPath}`);
```

Do not use raw shell strings.

Do not send shell commands from backend.

Do not let user input touch shell commands.

---

# 19. Agent terminal messages

This is important for good UX.

## 19.1 After login

```txt
K6 Lab Agent connected successfully.

Agent: My Laptop
API: https://api.k6lab.com

Now start the agent:

k6lab-agent start
```

## 19.2 After start

```txt
Starting K6 Lab Agent...

Checking k6 installation...
k6 is installed and ready.

Connected to K6 Lab dashboard.
Agent is online.

You can now create a test from your dashboard.
Waiting for jobs...
```

## 19.3 While idle

Do not spam every 3 seconds.

Good:

```txt
Waiting for jobs...
```

Then stay quiet.

Optional every 60 seconds:

```txt
Still connected. Waiting for jobs...
```

## 19.4 When test starts

```txt
New test received: Users API Test

GET http://localhost:5000/api/users
VUs: 10
Duration: 30s

Running k6 locally...
Please keep this terminal open.
You can monitor progress in your K6 Lab dashboard.
```

## 19.5 When test completes

```txt
Test completed successfully.

Results uploaded to your K6 Lab dashboard.
Open the dashboard to view the full performance report.
```

Later:

```txt
AI suggestions are available in your dashboard.
```

## 19.6 When test fails

```txt
Test failed.

Reason:
connect ECONNREFUSED 127.0.0.1:5000

The result was uploaded to your dashboard.
Please check your local API and try again.
```

## 19.7 When user presses Ctrl + C

```txt
Stopping K6 Lab Agent...

If a test is running, stopping it now.
Agent stopped.
```

---

# 20. Should terminal show the final result?

No.

Terminal should not show the full result table.

Terminal should only say:

```txt
Results uploaded. Check dashboard.
```

Reason:

```txt
Frontend dashboard is the main product experience.
Terminal is only the background worker interface.
```

You can show a tiny summary if you want:

```txt
Test completed.
Total requests: 1250
Full report available in dashboard.
```

But the best MVP behavior:

```txt
Do not show full terminal result.
Only guide user to dashboard.
```

---

# 21. Result dashboard

The frontend result page should show:

```txt
Status
Test name
URL
Method
VUs
Duration
Total requests
Average response time
Minimum response time
Maximum response time
p90 response time
p95 response time
Failed request rate
Checks passed
Checks failed
Logs preview
AI suggestions later
```

Example final dashboard:

```txt
Test Completed ✅

Endpoint:
GET http://localhost:5000/api/users

Configuration:
VUs: 10
Duration: 30s

Performance:
Total Requests: 1250
Average Response Time: 120ms
p95 Response Time: 310ms
Failed Request Rate: 1%

Checks:
Passed: 1240
Failed: 10

AI Suggestions:
Coming soon
```

---

# 22. AI suggestions later

Do not build AI first.

First store clean result metrics.

Later AI can analyze:

```txt
High p95 response time
High failed request rate
Timeouts
Expected status failures
Slow endpoint warning
Too many VUs for local machine
```

AI suggestion examples:

```txt
Your p95 response time is much higher than the average. This may indicate occasional slow database queries or cold routes.
```

```txt
Failed request rate is 8%. Check backend logs for errors under concurrent load.
```

```txt
Your local API refused connections. Make sure the backend server is running before starting the test.
```

For now, frontend can show:

```txt
AI suggestions will appear here in a later version.
```

---

# 23. Job status lifecycle

Use these statuses:

```txt
queued
running
completed
failed
cancel_requested
cancelled
```

Recommended transitions:

```txt
queued → running → completed
queued → running → failed
queued → cancelled
running → cancel_requested → cancelled
running → failed
```

---

## 23.1 Status meaning

| Status | Meaning |
|---|---|
| queued | Backend created job, agent has not picked it yet |
| running | Agent picked job and is running k6 |
| completed | k6 finished and result uploaded |
| failed | Something failed |
| cancel_requested | User clicked cancel while running |
| cancelled | Agent stopped the test |

---

# 24. Cancel / stop behavior

User can stop things in three ways.

## 24.1 Stop agent from terminal

User presses:

```txt
Ctrl + C
```

Agent should stop.

If a k6 process is running, agent should kill it.

Terminal:

```txt
Stopping K6 Lab Agent...
Stopping running test...
Agent stopped.
```

Backend should eventually mark agent offline because heartbeat stops.

If a job was running, backend should mark it failed or cancelled.

Recommended:

```txt
If agent disconnects during running job:
status = failed
error = "Agent disconnected during test"
```

---

## 24.2 Cancel test from dashboard

Frontend has button:

```txt
Cancel Test
```

Call:

```txt
POST /api/tests/:jobId/cancel
```

Backend updates:

```txt
status = cancel_requested
```

Agent checks job status while k6 is running.

If status becomes `cancel_requested`, agent kills k6 process.

Then agent uploads:

```json
{
  "status": "cancelled",
  "message": "Test cancelled by user"
}
```

Backend updates:

```txt
cancel_requested → cancelled
```

---

## 24.3 Deactivate agent from dashboard

Frontend can allow:

```txt
Deactivate Agent
```

Backend marks:

```txt
agent.status = disabled
```

Next heartbeat response:

```json
{
  "success": false,
  "code": "AGENT_DISABLED",
  "message": "This agent has been disabled from dashboard."
}
```

Agent should stop itself.

---

# 25. Detect offline agents

Agent sends heartbeat every few seconds.

Example:

```txt
Every 5 seconds
```

Backend stores:

```js
lastSeenAt = new Date()
```

Frontend/back-end can consider agent offline if:

```txt
lastSeenAt older than 30 seconds
```

Agent status logic:

```js
const isOnline = Date.now() - new Date(agent.lastSeenAt).getTime() < 30000;
```

Do not depend only on stored `status`.

Use `lastSeenAt` as source of truth.

---

# 26. Backend API routes

## 26.1 Auth routes

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

---

## 26.2 Agent routes for frontend

### Get current user's agents

```txt
GET /api/agents/me
```

Purpose:

Dashboard checks whether setup is required.

Response if no agent:

```json
{
  "success": true,
  "hasAgent": false,
  "activeAgent": null,
  "agents": [],
  "setupRequired": true
}
```

Response if agent online:

```json
{
  "success": true,
  "hasAgent": true,
  "activeAgent": {
    "id": "agent_123",
    "name": "My Laptop",
    "status": "online",
    "lastSeenAt": "2026-06-01T10:00:00.000Z"
  },
  "agents": []
}
```

---

### Register agent

```txt
POST /api/agents/register
```

Purpose:

Create a local agent and return one-time token.

Request:

```json
{
  "name": "My Laptop"
}
```

Response:

```json
{
  "success": true,
  "agent": {
    "id": "agent_123",
    "name": "My Laptop",
    "status": "offline"
  },
  "agentToken": "k6lab_agent_abc123",
  "commands": [
    "npm install -g k6lab-agent",
    "k6lab-agent login k6lab_agent_abc123",
    "k6lab-agent start"
  ]
}
```

---

### Delete/revoke agent

```txt
DELETE /api/agents/:agentId
```

Purpose:

Revoke token and disable agent.

---

## 26.3 Agent routes used by CLI

### Verify agent token

```txt
POST /api/agent/verify-token
```

Headers:

```txt
Authorization: Bearer k6lab_agent_abc123
```

Response:

```json
{
  "success": true,
  "agent": {
    "id": "agent_123",
    "name": "My Laptop"
  }
}
```

---

### Heartbeat

```txt
POST /api/agent/heartbeat
```

Headers:

```txt
Authorization: Bearer k6lab_agent_abc123
```

Response:

```json
{
  "success": true,
  "message": "Heartbeat received"
}
```

---

### Get next job

```txt
GET /api/agent/jobs/next
```

Headers:

```txt
Authorization: Bearer k6lab_agent_abc123
```

Response if no job:

```json
{
  "success": true,
  "job": null
}
```

Response if job exists:

```json
{
  "success": true,
  "job": {
    "id": "job_123",
    "name": "Users API Test",
    "config": {
      "url": "http://localhost:5000/api/users",
      "method": "GET",
      "vus": 10,
      "duration": "30s"
    }
  }
}
```

---

### Upload logs

```txt
POST /api/agent/jobs/:jobId/logs
```

Request:

```json
{
  "logs": "running k6 locally..."
}
```

---

### Upload result

```txt
POST /api/agent/jobs/:jobId/result
```

Request:

```json
{
  "status": "completed",
  "summary": {
    "metrics": {}
  },
  "logs": "..."
}
```

---

### Mark job failed

```txt
POST /api/agent/jobs/:jobId/fail
```

Request:

```json
{
  "error": "connect ECONNREFUSED 127.0.0.1:5000"
}
```

---

## 26.4 Test routes used by frontend

### Create test

```txt
POST /api/tests
```

Request:

```json
{
  "name": "Users API Test",
  "url": "http://localhost:5000/api/users",
  "method": "GET",
  "vus": 10,
  "duration": "30s",
  "headers": {},
  "body": null,
  "expectedStatus": 200,
  "maxResponseTimeMs": 1000,
  "sleepSeconds": 1
}
```

Response:

```json
{
  "success": true,
  "message": "Test queued successfully. Your local agent will start it automatically.",
  "job": {
    "id": "job_123",
    "status": "queued"
  }
}
```

---

### Get test

```txt
GET /api/tests/:jobId
```

Response:

```json
{
  "success": true,
  "job": {
    "id": "job_123",
    "status": "completed",
    "config": {},
    "result": {},
    "logs": "",
    "error": null
  }
}
```

---

### List tests

```txt
GET /api/tests
```

---

### Cancel test

```txt
POST /api/tests/:jobId/cancel
```

---

# 27. Database models

## 27.1 User

```js
{
  _id: "user_123",
  name: "Jay",
  email: "jay@example.com",
  passwordHash: "...",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 27.2 Agent

```js
{
  _id: "agent_123",
  userId: "user_123",

  name: "My Laptop",

  tokenHash: "...",
  tokenLastFour: "c123",

  status: "offline", // online | offline | disabled
  lastSeenAt: null,

  createdAt: Date,
  updatedAt: Date,
  disabledAt: null
}
```

Important:

```txt
Do not store raw agent token.
Only store hash.
Show raw token once.
```

---

## 27.3 TestJob

```js
{
  _id: "job_123",

  userId: "user_123",
  agentId: "agent_123",

  status: "queued",
  // queued | running | completed | failed | cancel_requested | cancelled

  name: "Users API Test",

  config: {
    url: "http://localhost:5000/api/users",
    method: "GET",
    vus: 10,
    duration: "30s",

    headers: {},
    body: null,

    expectedStatus: 200,
    maxResponseTimeMs: 1000,
    sleepSeconds: 1,
    timeout: "30s"
  },

  result: null,

  logs: "",

  error: null,

  createdAt: Date,
  startedAt: null,
  completedAt: null,
  cancelledAt: null
}
```

---

## 27.4 Optional extracted metrics

You can store extracted metrics separately for dashboard speed.

```js
{
  totalRequests: 1250,
  avgResponseTime: 120,
  minResponseTime: 20,
  maxResponseTime: 900,
  p90ResponseTime: 230,
  p95ResponseTime: 310,
  failedRequestRate: 0.01,
  checksPassed: 1240,
  checksFailed: 10
}
```

---

# 28. Backend validation rules

Even though tests run on the user's laptop, still validate everything.

## 28.1 Required fields

```txt
name
url
method
vus
duration
```

## 28.2 Method validation

Allowed:

```txt
GET
POST
PUT
PATCH
DELETE
```

## 28.3 URL validation

Allow:

```txt
http://localhost:5000
http://127.0.0.1:5000
http://192.168.1.5:8000
https://api.example.com
```

Because this is local agent mode, localhost/private IPs are okay.

Still ensure it is a valid URL.

## 28.4 VUs limit

Recommended MVP:

```txt
min: 1
max: 100
```

Why not unlimited?

```txt
User's laptop can freeze.
User's local backend can crash.
User's WiFi/router can overload.
Huge tests can create large logs.
```

## 28.5 Duration limit

Recommended MVP:

```txt
min: 1s
max: 10m
```

Later:

```txt
Advanced setting can allow 30m or more.
```

## 28.6 Body size

Recommended:

```txt
max: 1 MB
```

## 28.7 Headers limit

Recommended:

```txt
max headers: 30
max header key length: 100
max header value length: 2000
```

## 28.8 Logs/result limits

Recommended:

```txt
max logs upload: 2 MB
max summary JSON: 5 MB
```

---

# 29. CLI agent project structure

```txt
agent/
  package.json
  src/
    index.js
    commands/
      login.js
      start.js
      status.js
      logout.js
    services/
      api.js
      configStore.js
      k6Checker.js
      scriptGenerator.js
      runner.js
      cleanup.js
    utils/
      sleep.js
      logger.js
```

---

# 30. package.json for CLI

```json
{
  "name": "k6lab-agent",
  "version": "1.0.0",
  "description": "Local agent for K6 Lab load testing",
  "type": "module",
  "bin": {
    "k6lab-agent": "./src/index.js"
  },
  "dependencies": {
    "axios": "latest",
    "commander": "latest",
    "fs-extra": "latest"
  }
}
```

During development:

```bash
cd agent
npm install
npm link
k6lab-agent --help
```

Production:

```bash
npm publish
npm install -g k6lab-agent
```

If package name is taken:

```bash
npm install -g @yourname/k6lab-agent
```

But command can still be:

```bash
k6lab-agent
```

because of the `bin` field.

---

# 31. CLI entry file

File:

```txt
agent/src/index.js
```

```js
#!/usr/bin/env node

import { Command } from "commander";
import { login } from "./commands/login.js";
import { start } from "./commands/start.js";
import { status } from "./commands/status.js";
import { logout } from "./commands/logout.js";

const program = new Command();

program
  .name("k6lab-agent")
  .description("Local agent for K6 Lab")
  .version("1.0.0");

program
  .command("login")
  .description("Login with your K6 Lab agent token")
  .argument("<token>", "Agent token from K6 Lab dashboard")
  .action(login);

program
  .command("start")
  .description("Start agent and wait for dashboard jobs")
  .action(start);

program
  .command("status")
  .description("Show local agent login status")
  .action(status);

program
  .command("logout")
  .description("Remove local agent token")
  .action(logout);

program.parse();
```

---

# 32. Config storage

Use:

```txt
~/.k6lab/config.json
```

File:

```txt
agent/src/services/configStore.js
```

```js
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
```

---

# 33. Login command

File:

```txt
agent/src/commands/login.js
```

```js
import axios from "axios";
import { saveConfig } from "../services/configStore.js";

export async function login(token) {
  const apiUrl = process.env.K6LAB_API_URL || "https://api.k6lab.com";

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
    console.error("");
    process.exit(1);
  }
}
```

For local development:

```bash
K6LAB_API_URL=http://localhost:5000 k6lab-agent login YOUR_TOKEN
```

---

# 34. API service

File:

```txt
agent/src/services/api.js
```

```js
import axios from "axios";
import { getConfig } from "./configStore.js";

async function createClient() {
  const config = await getConfig();

  return axios.create({
    baseURL: config.apiUrl,
    headers: {
      Authorization: `Bearer ${config.agentToken}`
    },
    timeout: 10000
  });
}

export async function sendHeartbeat() {
  const api = await createClient();
  const res = await api.post("/api/agent/heartbeat");
  return res.data;
}

export async function getNextJob() {
  const api = await createClient();
  const res = await api.get("/api/agent/jobs/next");
  return res.data.job;
}

export async function getJobStatus(jobId) {
  const api = await createClient();
  const res = await api.get(`/api/agent/jobs/${jobId}/status`);
  return res.data.job;
}

export async function uploadLogs(jobId, logs) {
  const api = await createClient();
  const res = await api.post(`/api/agent/jobs/${jobId}/logs`, {
    logs
  });
  return res.data;
}

export async function uploadResult(jobId, payload) {
  const api = await createClient();
  const res = await api.post(`/api/agent/jobs/${jobId}/result`, payload);
  return res.data;
}

export async function failJob(jobId, error) {
  const api = await createClient();
  const res = await api.post(`/api/agent/jobs/${jobId}/fail`, {
    error
  });
  return res.data;
}

export async function cancelJob(jobId, message) {
  const api = await createClient();
  const res = await api.post(`/api/agent/jobs/${jobId}/cancelled`, {
    message
  });
  return res.data;
}
```

---

# 35. Check k6 installed

File:

```txt
agent/src/services/k6Checker.js
```

```js
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
```

If k6 is missing, terminal should say:

```txt
k6 is not installed.

Install it first:
macOS: brew install k6
Windows: winget install k6 --source winget

Then run:
k6lab-agent start
```

---

# 36. Generate local k6 script

File:

```txt
agent/src/services/scriptGenerator.js
```

```js
import fs from "fs-extra";
import os from "os";
import path from "path";

export async function createK6Script(job) {
  const jobDir = path.join(os.homedir(), ".k6lab", "jobs", job.id);

  await fs.ensureDir(jobDir);

  const scriptPath = path.join(jobDir, "script.js");
  const summaryPath = path.join(jobDir, "summary.json");
  const logsPath = path.join(jobDir, "logs.txt");
  const metadataPath = path.join(jobDir, "metadata.json");

  await fs.writeJson(
    metadataPath,
    {
      jobId: job.id,
      name: job.name,
      config: job.config,
      createdAt: new Date().toISOString()
    },
    { spaces: 2 }
  );

  const escapedSummaryPath = summaryPath.replaceAll("\\", "\\\\");

  const script = `
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: Number(__ENV.K6LAB_VUS || 1),
  duration: __ENV.K6LAB_DURATION || "10s",
};

export default function () {
  const method = __ENV.K6LAB_METHOD || "GET";
  const url = __ENV.K6LAB_URL;

  const headers = JSON.parse(__ENV.K6LAB_HEADERS || "{}");
  const body = __ENV.K6LAB_BODY || null;

  const params = {
    headers,
    timeout: __ENV.K6LAB_TIMEOUT || "30s"
  };

  const res = http.request(method, url, body, params);

  check(res, {
    "status is expected": (r) => {
      const expectedStatus = Number(__ENV.K6LAB_EXPECTED_STATUS || 200);
      return r.status === expectedStatus;
    },
    "response time is acceptable": (r) => {
      const maxMs = Number(__ENV.K6LAB_MAX_RESPONSE_TIME_MS || 1000);
      return r.timings.duration < maxMs;
    }
  });

  const sleepSeconds = Number(__ENV.K6LAB_SLEEP_SECONDS || 1);
  sleep(sleepSeconds);
}

export function handleSummary(data) {
  return {
    "${escapedSummaryPath}": JSON.stringify(data)
  };
}
`.trim();

  await fs.writeFile(scriptPath, script, "utf8");

  return {
    jobDir,
    scriptPath,
    summaryPath,
    logsPath,
    metadataPath
  };
}
```

---

# 37. Run k6 safely

File:

```txt
agent/src/services/runner.js
```

```js
import { spawn } from "child_process";
import fs from "fs-extra";

let currentProcess = null;

export function stopCurrentK6Process() {
  if (currentProcess) {
    currentProcess.kill("SIGTERM");
  }
}

export function runK6(scriptPath, job, logsPath) {
  return new Promise((resolve, reject) => {
    currentProcess = spawn("k6", ["run", scriptPath], {
      shell: false,
      env: {
        ...process.env,

        K6LAB_URL: job.config.url,
        K6LAB_METHOD: job.config.method,
        K6LAB_VUS: String(job.config.vus),
        K6LAB_DURATION: job.config.duration,

        K6LAB_HEADERS: JSON.stringify(job.config.headers || {}),
        K6LAB_BODY:
          job.config.body === null || job.config.body === undefined
            ? ""
            : typeof job.config.body === "string"
              ? job.config.body
              : JSON.stringify(job.config.body),

        K6LAB_EXPECTED_STATUS: String(job.config.expectedStatus || 200),
        K6LAB_MAX_RESPONSE_TIME_MS: String(job.config.maxResponseTimeMs || 1000),
        K6LAB_SLEEP_SECONDS: String(job.config.sleepSeconds ?? 1),
        K6LAB_TIMEOUT: job.config.timeout || "30s"
      }
    });

    let stdout = "";
    let stderr = "";

    currentProcess.stdout.on("data", async (data) => {
      const text = data.toString();
      stdout += text;
      await fs.appendFile(logsPath, text);
    });

    currentProcess.stderr.on("data", async (data) => {
      const text = data.toString();
      stderr += text;
      await fs.appendFile(logsPath, text);
    });

    currentProcess.on("error", (err) => {
      currentProcess = null;
      reject(err);
    });

    currentProcess.on("close", (code) => {
      currentProcess = null;

      if (code === 0) {
        resolve({
          stdout,
          stderr,
          logs: stdout + stderr
        });
      } else {
        reject(new Error(`k6 exited with code ${code}\n${stderr || stdout}`));
      }
    });
  });
}
```

---

# 38. Start command with final UX

File:

```txt
agent/src/commands/start.js
```

```js
import fs from "fs-extra";
import { checkK6Installed } from "../services/k6Checker.js";
import {
  sendHeartbeat,
  getNextJob,
  uploadResult,
  uploadLogs,
  failJob
} from "../services/api.js";
import { createK6Script } from "../services/scriptGenerator.js";
import { runK6, stopCurrentK6Process } from "../services/runner.js";
import { sleep } from "../utils/sleep.js";

let isShuttingDown = false;

process.on("SIGINT", async () => {
  console.log("");
  console.log("Stopping K6 Lab Agent...");

  isShuttingDown = true;
  stopCurrentK6Process();

  console.log("Agent stopped.");
  process.exit(0);
});

export async function start() {
  console.log("");
  console.log("Starting K6 Lab Agent...");
  console.log("");

  try {
    console.log("Checking k6 installation...");
    await checkK6Installed();

    console.log("k6 is installed and ready.");
    console.log("");
    console.log("Connected to K6 Lab dashboard.");
    console.log("Agent is online.");
    console.log("");
    console.log("You can now create a test from your dashboard.");
    console.log("Waiting for jobs...");
    console.log("");

    while (!isShuttingDown) {
      try {
        await sendHeartbeat();

        const job = await getNextJob();

        if (!job) {
          await sleep(3000);
          continue;
        }

        console.log("");
        console.log(`New test received: ${job.name || job.id}`);
        console.log("");
        console.log(`${job.config.method} ${job.config.url}`);
        console.log(`VUs: ${job.config.vus}`);
        console.log(`Duration: ${job.config.duration}`);
        console.log("");
        console.log("Running k6 locally...");
        console.log("Please keep this terminal open.");
        console.log("You can monitor progress in your K6 Lab dashboard.");
        console.log("");

        try {
          const { scriptPath, summaryPath, logsPath } = await createK6Script(job);

          const runResult = await runK6(scriptPath, job, logsPath);

          let summary = null;

          if (await fs.pathExists(summaryPath)) {
            summary = await fs.readJson(summaryPath);
          }

          await uploadLogs(job.id, runResult.logs);

          await uploadResult(job.id, {
            status: "completed",
            summary,
            logs: runResult.logs
          });

          console.log("");
          console.log("Test completed successfully.");
          console.log("");
          console.log("Results uploaded to your K6 Lab dashboard.");
          console.log("Open the dashboard to view the full performance report.");
          console.log("");
          console.log("Waiting for jobs...");
          console.log("");
        } catch (err) {
          await failJob(job.id, err.message);

          console.log("");
          console.log("Test failed.");
          console.log("");
          console.log("Reason:");
          console.log(err.message);
          console.log("");
          console.log("The failure details were uploaded to your dashboard.");
          console.log("Please check your local API and try again.");
          console.log("");
          console.log("Waiting for jobs...");
          console.log("");
        }
      } catch (err) {
        console.error("Agent connection error:", err.message);
        await sleep(5000);
      }
    }
  } catch (err) {
    console.error("");
    console.error(err.message);
    console.error("");
    console.error("Fix the issue and run:");
    console.error("");
    console.error("k6lab-agent start");
    console.error("");
    process.exit(1);
  }
}
```

---

# 39. Extract useful metrics from k6 summary

Backend can store raw summary, but also extract dashboard metrics.

```js
export function extractK6Metrics(summary) {
  const metrics = summary?.metrics || {};

  return {
    totalRequests: metrics.http_reqs?.count || 0,

    avgResponseTime: metrics.http_req_duration?.avg || 0,
    minResponseTime: metrics.http_req_duration?.min || 0,
    maxResponseTime: metrics.http_req_duration?.max || 0,
    p90ResponseTime: metrics.http_req_duration?.["p(90)"] || 0,
    p95ResponseTime: metrics.http_req_duration?.["p(95)"] || 0,

    failedRequestRate: metrics.http_req_failed?.rate || 0,

    checksPassed: metrics.checks?.passes || 0,
    checksFailed: metrics.checks?.fails || 0,

    iterations: metrics.iterations?.count || 0,
    dataReceived: metrics.data_received?.count || 0,
    dataSent: metrics.data_sent?.count || 0
  };
}
```

---

# 40. Frontend pages

## 40.1 Dashboard page

Responsibilities:

```txt
1. Check auth user.
2. Call GET /api/agents/me.
3. If no active agent, show setup screen.
4. If agent online, show create test button/form.
5. Show recent tests.
```

---

## 40.2 Agent setup page

Show:

```txt
Connect your local agent

K6 Lab runs tests from your own laptop, so localhost URLs work correctly.
```

Steps:

```txt
1. Install k6
2. Install K6 Lab Agent
3. Login with agent token
4. Start the agent
```

Commands section:

```bash
npm install -g k6lab-agent
k6lab-agent login k6lab_agent_abc123
k6lab-agent start
```

Also show:

```txt
After the agent starts, this page will automatically detect it.
```

---

## 40.3 Create test page

Only show when agent is online.

Fields:

```txt
Test Name
Endpoint URL
HTTP Method
VUs
Duration
Headers
Body
Expected Status
Max Response Time
Sleep Between Requests
Timeout
```

Button:

```txt
Start Test
```

After click:

```txt
Test queued.
Your local agent will start it automatically.
```

---

## 40.4 Running test page

Show:

```txt
Test running...
Your local agent is running k6 on your machine.
Please keep the terminal open.
```

Show config:

```txt
URL
Method
VUs
Duration
Started at
Agent status
```

Optional logs preview:

```txt
Running k6 locally...
```

---

## 40.5 Result page

Show:

```txt
Test Completed
Performance Summary
Charts
Checks
Logs
AI Suggestions later
```

Cards:

```txt
Total Requests
Average Response Time
p95 Response Time
Failed Request Rate
Checks Passed
Checks Failed
```

---

# 41. Frontend polling

## 41.1 Agent setup polling

While setup screen is open:

```txt
GET /api/agents/me every 3 seconds
```

If agent becomes online:

```txt
Show success
Unlock create test
```

---

## 41.2 Test status polling

On test result page:

```txt
GET /api/tests/:jobId every 2-3 seconds
```

Stop polling when:

```txt
completed
failed
cancelled
```

---

# 42. Development setup

## 42.1 Start backend

```bash
cd backend
npm install
npm run dev
```

Backend:

```txt
http://localhost:5000
```

## 42.2 Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

## 42.3 Link agent locally

```bash
cd agent
npm install
npm link
```

Now test:

```bash
k6lab-agent --help
```

Login to local backend:

```bash
K6LAB_API_URL=http://localhost:5000 k6lab-agent login YOUR_AGENT_TOKEN
```

Start:

```bash
k6lab-agent start
```

---

# 43. MVP build order

Build in this order.

## Phase 1: Backend base

```txt
[ ] User register/login
[ ] JWT auth middleware
[ ] User model
[ ] Agent model
[ ] TestJob model
```

## Phase 2: Agent setup

```txt
[ ] GET /api/agents/me
[ ] POST /api/agents/register
[ ] Generate raw token
[ ] Hash token before storing
[ ] Return raw token once
[ ] POST /api/agent/verify-token
[ ] POST /api/agent/heartbeat
```

## Phase 3: CLI agent

```txt
[ ] Create agent package
[ ] Add package.json bin
[ ] Add commander CLI
[ ] Add login command
[ ] Save token in ~/.k6lab/config.json
[ ] Add start command
[ ] Check k6 installed
[ ] Send heartbeat
[ ] Poll backend
```

## Phase 4: Test jobs

```txt
[ ] POST /api/tests
[ ] Validate active online agent
[ ] Validate test config
[ ] Create queued job
[ ] GET /api/agent/jobs/next
[ ] Atomically assign queued job to agent
[ ] Mark job running
```

## Phase 5: Run k6

```txt
[ ] Generate local script.js
[ ] Store files in ~/.k6lab/jobs/jobId
[ ] Run k6 with spawn()
[ ] Capture stdout/stderr
[ ] Write logs.txt
[ ] Read summary.json
[ ] Upload result
[ ] Mark job completed/failed
```

## Phase 6: Frontend UX

```txt
[ ] Signup/login UI
[ ] Dashboard agent status check
[ ] Agent setup screen
[ ] Create agent token button
[ ] Commands UI with copy button
[ ] Detect agent online
[ ] Create test form
[ ] Running test page
[ ] Result dashboard
```

## Phase 7: Polish

```txt
[ ] Cancel test
[ ] Agent offline detection
[ ] Better error messages
[ ] Logs preview
[ ] Chart UI
[ ] Test history
[ ] Cleanup old local files
```

---

# 44. MVP limitations

For first version:

```txt
Only Agent Mode
Only one active agent per user
Only one running job per agent
Max VUs: 100
Max duration: 10m
Max body size: 1 MB
Max logs upload: 2 MB
Polling instead of WebSocket
No Docker
No Kubernetes
No cloud runner
No AI initially
```

---

# 45. Error scenarios and frontend messages

## Agent not installed

User has not installed CLI.

Frontend:

```txt
Install the K6 Lab Agent first.
```

## Agent not started

Backend has agent but offline.

Frontend:

```txt
Your agent is offline.
Run: k6lab-agent start
```

## k6 not installed

Agent terminal:

```txt
k6 is not installed.
Install k6 first, then run k6lab-agent start.
```

Dashboard:

```txt
Agent failed because k6 is not installed on your machine.
```

## Local API not running

Agent error:

```txt
connect ECONNREFUSED 127.0.0.1:5000
```

Dashboard:

```txt
Your local API is not reachable. Make sure your backend server is running.
```

## Invalid URL

Backend response:

```txt
Please enter a valid URL.
```

## Test cancelled

Dashboard:

```txt
Test cancelled by user.
```

## Agent disconnected during test

Dashboard:

```txt
Agent disconnected while the test was running.
Please restart the agent and try again.
```

---

# 46. Security rules

## Rule 1: Never store raw token in DB

Store:

```txt
hash(token)
```

Not:

```txt
token
```

## Rule 2: Backend sends config, not shell commands

Good:

```json
{
  "url": "http://localhost:5000/api/users",
  "method": "GET",
  "vus": 10
}
```

Bad:

```json
{
  "command": "k6 run script.js"
}
```

## Rule 3: Agent uses spawn with shell false

Good:

```js
spawn("k6", ["run", scriptPath], { shell: false });
```

Bad:

```js
exec(`k6 run ${scriptPath}`);
```

## Rule 4: Agent can only access own jobs

When agent calls:

```txt
GET /api/agent/jobs/next
```

Backend must use token to identify agent and user.

Never accept `userId` from agent request body.

## Rule 5: Validate all config

Validate:

```txt
url
method
vus
duration
headers
body
expectedStatus
maxResponseTimeMs
```

## Rule 6: Limit uploads

Limit:

```txt
logs
summary JSON
body size
headers count
```

## Rule 7: Token should be revocable

Frontend should allow:

```txt
Delete agent
Revoke token
Generate new token
```

---

# 47. Final recommended user-facing copy

## Setup screen

```txt
Connect your local agent

K6 Lab runs load tests from your own machine. This lets you test localhost APIs like http://localhost:5000.

Run the commands below in your terminal. Once the agent is online, you can create your first test.
```

## Terminal after start

```txt
K6 Lab Agent is running.

Connected to your dashboard.
You can now create a test from the frontend.

Waiting for jobs...
```

## Running dashboard

```txt
Your test is running locally.

The K6 Lab Agent is running k6 on your machine.
Please keep the terminal open until the test completes.
```

## Complete terminal

```txt
Test completed successfully.
Results uploaded to your dashboard.
Open K6 Lab to view the full report.
```

## Complete dashboard

```txt
Test completed.
Review performance metrics below.
AI suggestions will appear here in a future version.
```

---

# 48. Final key decisions

```txt
1. Only Agent Mode for now.
2. No agent selection in MVP.
3. One active agent per user.
4. Setup agent before showing test form.
5. Terminal only shows status messages.
6. Dashboard shows actual result.
7. Agent stores files in ~/.k6lab/jobs.
8. Do not create k6 folder in user's project root by default.
9. Agent runs k6 using spawn, not exec.
10. Backend stores jobs and results.
```

---

# 49. Final simplest full flow

```txt
User signs up
↓
Dashboard says: connect local agent
↓
User generates agent token
↓
Dashboard shows terminal commands
↓
User runs commands
↓
Agent starts and says: create test in dashboard
↓
Dashboard detects agent online
↓
User creates test
↓
Backend creates queued job
↓
Agent picks job
↓
Terminal says: running test, check dashboard
↓
Dashboard says: test running
↓
Agent runs k6 locally
↓
Agent uploads result
↓
Terminal says: result uploaded, check dashboard
↓
Dashboard shows beautiful report
↓
AI suggestions can be added later
```

This is the final Agent Mode design for K6 Lab.
