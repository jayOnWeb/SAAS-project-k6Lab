# K6 Lab Website Content

> A focused 5-page marketing website for K6 Lab.
>
> The goal is to make K6 Lab feel like a premium developer-focused SaaS product while clearly explaining its actual core capabilities.

---

# Website Structure

```text
K6 LAB
│
├── Home
│   ├── Hero
│   ├── Problem
│   ├── Local-First Architecture
│   ├── Features Preview
│   ├── AI Audit Preview
│   └── CTA
│
├── Features
│   ├── Local Agent
│   ├── Native k6
│   ├── Real-Time Telemetry
│   ├── Timing Breakdown
│   └── AI Audit
│
├── How It Works
│   ├── Connect Machine
│   ├── Configure Test
│   ├── Agent Receives Job
│   ├── k6 Runs Locally
│   ├── Telemetry Streams
│   └── AI Audit
│
├── Platform
│   ├── Live Test
│   ├── Metrics
│   ├── Live Logs
│   └── AI Audit
│
└── Docs
    ├── Install k6
    ├── Install Agent
    ├── Login Agent
    ├── Start Agent
    └── Run First Test
```

---

# 1. Home / Landing Page

**Route:** `/`

## Purpose

The visitor should understand within a few seconds:

- What K6 Lab is.
- What problem it solves.
- Why local-first testing matters.
- What the product experience looks like.
- How AI helps after a test.

---

## Hero Section

### Eyebrow

```text
LOCAL-FIRST PERFORMANCE TESTING
```

### Heading

```text
Stress Test Your APIs.
Understand Their Limits.
```

### Subheading

```text
Run native k6 load tests directly from your own machine,
watch real-time telemetry as it happens, and get actionable
AI-powered insights from your actual performance data.
```

### Primary CTA

```text
Start Testing Free →
```

### Secondary CTA

```text
See How It Works
```

### Supporting Statement

```text
Your machine runs the test.
K6 Lab makes sense of the result.
```

### Hero Visual

Display a premium telemetry cockpit preview:

```text
LIVE TEST

API RESPONSE TIME

142ms

P95
280ms

REQUESTS
12,482

ERROR RATE
0.08%

● AGENT ONLINE
```

The visual should immediately communicate that K6 Lab is a real developer performance tool.

---

## Problem Section

### Heading

```text
Performance Testing Shouldn't Feel Like Guesswork.
```

### Intro

```text
Your APIs aren't always public.

Your performance data is more than a wall of numbers.

And generic advice rarely tells you what to test next.
```

### Card 01 — Local APIs

```text
Test localhost, private APIs, internal services, and development
environments directly from the machine that can reach them.
```

### Card 02 — Raw Metrics

```text
Latency numbers tell you what happened.
They don't always tell you why it happened.
```

### Card 03 — Generic Advice

```text
You don't need another vague recommendation.

You need insight based on the actual behaviour of your system.
```

---

## Core Product Explanation

### Heading

```text
Your Machine Runs the Test.
K6 Lab Makes Sense of the Results.
```

### Copy

```text
K6 Lab uses a local-first architecture.

Your local k6lab-agent executes native k6 directly on your machine.
K6 Lab coordinates the test and brings the telemetry, logs, and
performance data into one focused cockpit.
```

### Architecture Visual

```text
YOUR MACHINE
      ↓
k6lab-agent
      ↓
Native k6
      ↓
Live Telemetry
      ↓
K6 LAB COCKPIT
      ↓
Performance Insight
```

### Supporting Copy

```text
The dashboard coordinates the work.
Your machine executes the test.
The cockpit helps you understand the result.
```

---

## Features Preview

### Heading

```text
Everything You Need to Push Your API Further.
```

### Feature 01 — Local-First Execution

```text
Run tests against local and private environments without exposing
your APIs to a remote testing infrastructure.
```

### Feature 02 — Real-Time Telemetry

```text
Watch requests, latency, failures, and logs while your test is running.
```

### Feature 03 — Detailed Timing Breakdown

```text
Understand where time is being spent across connection, TLS,
waiting, sending, and receiving phases.
```

### Feature 04 — AI Performance Audit

```text
Turn your actual test results into direct, context-specific
recommendations for your next performance test.
```

---

## AI Audit Preview

### Heading

```text
Metrics Tell You What Happened.
AI Helps You Decide What to Do Next.
```

### Example Test Result

```text
TEST RESULT

P95 LATENCY
280ms

ERROR RATE
0.4%

VIRTUAL USERS
10
```

### Example AI Output

```text
PERFORMANCE AUDIT

Your API is handling 10 VUs cleanly with a low failure rate.

Next test:

Increase load to 20–50 VUs and run for 60 seconds
to identify where latency begins to degrade.

The current run does not indicate a clear bottleneck.
```

### CTA

```text
Audit Telemetry Run
```

---

## Final CTA

### Heading

```text
Know How Far Your System Can Go.
```

### Subheading

```text
Run your first local performance test with K6 Lab.
```

### CTA

```text
Get Started Free →
```

---

# 2. Features Page

**Route:** `/features`

## Purpose

The Home page introduces the product.

The Features page should explain each core capability in more detail.

---

## Hero

### Heading

```text
The Performance Cockpit for Your Local APIs.
```

### Subheading

```text
Run native k6 locally.
See your telemetry live.
Understand what to do next.
```

---

## Feature 01 — Local-First Architecture

### Heading

```text
Test Where Your Code Lives.
```

### Copy

```text
Not every API is public.

Your application might be running on localhost, inside a private
network, or within a development environment.

With K6 Lab, the test runs through a local agent on your machine,
so the machine that can reach your API is the machine that runs the test.
```

---

## Feature 02 — Native k6 Execution

### Heading

```text
Your Load Test Runs Where It Matters.
```

### Copy

```text
K6 Lab uses a local agent to execute native k6 tests directly
on your machine.

The platform handles coordination and visibility.
Your machine handles the actual load generation.
```

---

## Feature 03 — Real-Time Telemetry

### Heading

```text
Watch Your System Under Pressure.
```

### Copy

```text
See your test as it happens instead of waiting for a final report.

Monitor request volume, latency, failures, and live output from
the active agent.
```

### Metrics

```text
Average Latency
P90
P95
Minimum
Maximum
Total Requests
Successful Requests
Failed Requests
Failure Rate
```

---

## Feature 04 — Timing Breakdown

### Heading

```text
Latency Is More Than One Number.
```

### Copy

```text
Break down your request timing to understand where the time is going.
```

### Metrics

```text
Waiting / TTFB
Blocked
Sending
Receiving
TLS Handshake
Connecting
```

---

## Feature 05 — AI Performance Audit

### Heading

```text
Stop Staring at Metrics.
Start Knowing What to Test Next.
```

### Copy

```text
When your test is complete, trigger an AI-powered performance audit.

The audit looks at your actual test results and provides direct,
context-specific recommendations for exploring your system's limits.
```

### Supporting Statement

```text
No generic textbook clutter.
Just insight based on your telemetry.
```

---

# 3. How It Works Page

**Route:** `/how-it-works`

## Purpose

Explain K6 Lab's unique local-first architecture and the complete testing flow.

---

## Hero

### Heading

```text
From Your Terminal to Performance Insight.
```

### Subheading

```text
One local agent.
One native k6 test.
One focused performance cockpit.
```

---

## Step 01 — Connect Your Machine

### Heading

```text
Connect Your Machine.
```

### Copy

```text
Install the k6lab-agent CLI on the machine that can reach the
API you want to test.
```

---

## Step 02 — Configure Your Test

### Heading

```text
Configure Your Test.
```

### Copy

```text
Choose your target URL, virtual users, and test duration from
the K6 Lab platform.
```

---

## Step 03 — Your Local Agent Receives the Job

### Heading

```text
Your Local Agent Receives the Job.
```

### Copy

```text
The K6 Lab backend coordinates the test and your connected local
agent picks up the queued job.
```

---

## Step 04 — Native k6 Runs on Your Machine

### Heading

```text
Native k6 Runs on Your Machine.
```

### Copy

```text
The agent generates and executes the k6 test locally.

Your private or local API does not need to be exposed to a remote
load-testing server.
```

---

## Step 05 — Telemetry Streams Back in Real Time

### Heading

```text
Telemetry Streams Back in Real Time.
```

### Copy

```text
As the test runs, logs and performance data are sent back to the
K6 Lab cockpit so you can watch the run as it happens.
```

---

## Step 06 — Understand the Result

### Heading

```text
Understand the Result.
```

### Copy

```text
When the test is complete, review your final metrics and trigger
an AI Performance Audit to decide what to test next.
```

---

## Full Flow Visual

```text
CONFIGURE TEST
      ↓
QUEUE TEST JOB
      ↓
LOCAL AGENT
      ↓
NATIVE k6
      ↓
LIVE LOGS + TELEMETRY
      ↓
FINAL METRICS
      ↓
AI PERFORMANCE AUDIT
```

---

# 4. Platform Page

**Route:** `/platform`

## Purpose

This is a product showcase page.

It should make visitors feel like they are looking at the actual K6 Lab product.

The page should showcase:

- Live test monitoring.
- Telemetry.
- Metrics.
- Live logs.
- AI-powered performance analysis.

---

## Hero

### Heading

```text
See Your System Under Pressure.
In Real Time.
```

### Subheading

```text
A focused performance cockpit for watching your APIs,
understanding latency, and finding the next test worth running.
```

---

## Live Test Preview

```text
LIVE TEST

API STRESS TEST

● RUNNING

AGENT
ONLINE

REQUESTS
12,482

SUCCESS RATE
99.92%

P95
280ms
```

---

## Performance Metrics

### Heading

```text
Every Request Tells a Story.
```

### Copy

```text
K6 Lab brings the important signals together in one place,
so you can move from raw test output to actual understanding.
```

### Metrics

```text
Average
P90
P95
Min
Max
Requests
Errors
Failure Rate
```

---

## Live Logs

### Heading

```text
Don't Wait for the Test to Finish.
```

### Copy

```text
Follow the raw output from your active test as the local agent
executes it.
```

### Example

```text
[00:01] Starting k6 test...
[00:05] 1,240 requests completed
[00:10] Agent heartbeat received
[00:15] Test running...
```

---

## AI Audit

### Heading

```text
From Performance Data to the Next Experiment.
```

### Copy

```text
A completed test should not be the end of the process.

Use the results from one test to decide what to explore next.
```

### CTA

```text
Audit Telemetry Run
```

---

# 5. Docs / Getting Started Page

**Route:** `/docs`

## Purpose

Help a new developer get K6 Lab running as quickly as possible.

---

## Hero

### Heading

```text
Start Testing in Minutes.
```

### Subheading

```text
Connect your machine, run your first local test,
and start understanding your API's performance.
```

---

## Step 01 — Install k6

```text
K6 Lab uses native k6 for load-test execution.

Install k6 on the machine you want to use as your test agent.
```

---

## Step 02 — Install the Agent

```bash
npm install -g k6lab-agent
```

---

## Step 03 — Connect Your Agent

```bash
k6lab-agent login YOUR_AGENT_TOKEN
```

---

## Step 04 — Start the Agent

```bash
k6lab-agent start
```

---

## Step 05 — Run Your First Test

```text
Create a test from the K6 Lab platform.

Configure:

Target URL
Virtual Users
Duration

Then dispatch the test to your connected local agent.
```

---

## Step 06 — Watch the Results

```text
Monitor live logs and telemetry from the running test.

When the test is complete, review the final metrics and use the
AI Performance Audit to understand what to test next.
```

---

# Final 5-Page Website Structure

```text
K6 LAB
│
├── Home
│   ├── Hero
│   ├── Problem
│   ├── Local-First Architecture
│   ├── Features Preview
│   ├── AI Audit Preview
│   └── CTA
│
├── Features
│   ├── Local Agent
│   ├── Native k6
│   ├── Real-Time Telemetry
│   ├── Timing Breakdown
│   └── AI Audit
│
├── How It Works
│   ├── Connect Machine
│   ├── Configure Test
│   ├── Agent Receives Job
│   ├── k6 Runs Locally
│   ├── Telemetry Streams
│   └── AI Audit
│
├── Platform
│   ├── Live Test
│   ├── Metrics
│   ├── Live Logs
│   └── AI Audit
│
└── Docs
    ├── Install k6
    ├── Install Agent
    ├── Login Agent
    ├── Start Agent
    └── Run First Test
```

---

## Product Messaging Rule

K6 Lab should always be presented as:

> **A local-first performance testing platform with native k6 execution, real-time telemetry, and AI-powered performance insight.**

Do not add unrelated SaaS features or claims that are not currently part of the product.
