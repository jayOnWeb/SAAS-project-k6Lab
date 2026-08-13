const axios = require("axios");

// Fallback pool of known top free OpenRouter models
const STATIC_FREE_MODELS = [
  "liquid/lfm-2.5-2.6b:free",
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "poolside/laguna-s-2.1:free",
  "openrouter/free"
];

/**
 * Dynamically fetches all currently active free model IDs directly from OpenRouter API
 */
const fetchDynamicFreeModels = async () => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", { timeout: 8000 });
    const models = response.data?.data || [];
    const freeIds = models
      .filter((m) => m.id && (m.id.endsWith(":free") || m.id === "openrouter/free" || m.pricing?.prompt === "0"))
      .map((m) => m.id);
    return freeIds;
  } catch (err) {
    console.warn("Could not fetch dynamic free model list from OpenRouter:", err.message);
    return [];
  }
};

/**
 * Helper function to call OpenRouter API with static + dynamic model fallbacks
 */
const callOpenRouter = async (messages, temperature = 0.4) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API Key not configured in server environment (.env).");
  }

  let lastError = null;

  // 1. Try static list first
  for (const model of STATIC_FREE_MODELS) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model,
          messages: messages,
          temperature: temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://k6lab.duckdns.org",
            "X-Title": "K6 Lab Performance Studio",
          },
          timeout: 25000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return content;
      }
    } catch (err) {
      console.warn(`OpenRouter static model '${model}' returned error (${err.response?.status || err.message}). Trying next...`);
      lastError = err;
    }
  }

  // 2. If static list failed, dynamically query OpenRouter API for active free models
  console.log("Static free model pool exhausted. Querying OpenRouter live API for active free models...");
  const dynamicModels = await fetchDynamicFreeModels();

  for (const model of dynamicModels) {
    if (STATIC_FREE_MODELS.includes(model)) continue; // skip already tried

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model,
          messages: messages,
          temperature: temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://k6lab.duckdns.org",
            "X-Title": "K6 Lab Performance Studio",
          },
          timeout: 25000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return content;
      }
    } catch (err) {
      console.warn(`OpenRouter dynamic model '${model}' failed (${err.response?.status || err.message}).`);
      lastError = err;
    }
  }

  throw new Error(
    `OpenRouter free model error: ${lastError?.response?.data?.error?.message || lastError?.message || "All free models busy or offline. Please retry."}`
  );
};

/**
 * Generates a comprehensive, data-driven telemetry audit for a stress test run.
 * @param {Object} job - The MongoDB TestJob document
 * @returns {Promise<string>} Detailed AI performance analysis in Markdown format
 */
const generateTelemetryAudit = async (job) => {
  const isCompleted = job.status === "completed" && job.result;
  const failureRatePct = isCompleted ? (job.result.failedRequestRate * 100).toFixed(2) : "100.00";
  
  const telemetrySummary = isCompleted
    ? `
- Total Requests Fired: ${job.result.totalRequests || 0}
- Requests Per Second (RPS): ${job.result.requestsPerSecond ? job.result.requestsPerSecond.toFixed(2) : "N/A"}
- Average Latency: ${job.result.avgResponseTime ? job.result.avgResponseTime.toFixed(2) : 0} ms
- Min Latency: ${job.result.minResponseTime ? job.result.minResponseTime.toFixed(2) : 0} ms
- Max Latency: ${job.result.maxResponseTime ? job.result.maxResponseTime.toFixed(2) : 0} ms
- P95 (95th Percentile) Latency: ${job.result.p95ResponseTime ? job.result.p95ResponseTime.toFixed(2) : 0} ms
- Failed Requests: ${job.result.failedRequests || 0} (${failureRatePct}%)
- Checks Passed: ${job.result.checksPassed || 0}
- Checks Failed: ${job.result.checksFailed || 0}
`.trim()
    : `Test status is "${job.status}". Execution error: ${job.error || "Unknown failure"}`;

  const recentLogs = Array.isArray(job.logs) && job.logs.length > 0
    ? job.logs.slice(-15).join("\n")
    : "No recent execution log output.";

  const currentVUs = job.config?.vus || 1;
  const suggestedNextVUs = currentVUs <= 10 ? 50 : currentVUs <= 50 ? 100 : currentVUs <= 100 ? 250 : currentVUs * 2;

  const prompt = `
You are K6 Lab's Lead Senior Performance & Reliability AI Engineer.
Analyze the following k6 stress test run results for the user and provide a detailed, data-driven performance report.

### TEST CONFIGURATION:
- Test Name: ${job.name || "Load Test"}
- Target Endpoint: ${job.config?.method || "GET"} ${job.config?.url || "Target URL"}
- Virtual Users (VUs): ${currentVUs} VUs
- Target Duration: ${job.config?.duration || "10s"}
- Final Execution Status: ${job.status}

### METRICS & TELEMETRY DATA:
${telemetrySummary}

### EXECUTION LOG SNIPPET:
\`\`\`
${recentLogs}
\`\`\`

### ABSOLUTE MANDATORY RULES (STRICT COMPLIANCE REQUIRED):
1. NEVER INCLUDE ANY TYPE OF CODE, K6 SCRIPTS, JAVASCRIPT SNIPPETS, BASH/CLI COMMANDS, OR CODE BLOCKS (\`\`\`) IN YOUR OUTPUT.
2. Do NOT write any example code snippets, k6 scripts, or terminal commands under any section. All recommendations, fixes, explanations, and benchmark plans MUST be written purely in clear, analytical English text and Markdown bullet points.
3. You MUST explain what EACH metric shown in the dashboard means conceptually, and what its specific observed value in this test run indicates for the user's API.
4. You MUST suggest the next benchmark plan (e.g. scaling up from ${currentVUs} VUs to ${suggestedNextVUs} VUs) and explain how to optimize the API to handle that load safely under control.

### REQUIRED REPORT FORMAT:

1. 🎯 **Health Score & Executive Verdict**
   - Provide an overall Health Score out of 100 (e.g. **85/100 - GOOD**, **60/100 - NEEDS OPTIMIZATION**, **25/100 - CRITICAL BOTTLENECK**).
   - Provide a clear 2-3 sentence executive summary of overall endpoint performance and stability under ${currentVUs} Virtual Users.

2. 📖 **Dashboard Metrics Explanation & Deep Dive Analysis**
   Explain the conceptual meaning of EACH metric shown in the dashboard, followed by what its exact value from this test run signifies:
   - **Average Latency**: Explain what average response time means conceptually, and what ${job.result?.avgResponseTime ? job.result.avgResponseTime.toFixed(2) + ' ms' : 'N/A'} indicates about baseline speed.
   - **P95 Latency (95th Percentile)**: Explain what 95th percentile latency measures conceptually (95% of requests completed faster than this time), why it is critical for capturing tail latency, and what ${job.result?.p95ResponseTime ? job.result.p95ResponseTime.toFixed(2) + ' ms' : 'N/A'} reveals about potential slowdowns for 5% of users.
   - **Max Latency**: Explain what worst-case latency measures conceptually, and what ${job.result?.maxResponseTime ? job.result.maxResponseTime.toFixed(2) + ' ms' : 'N/A'} shows regarding single-request spikes or bottlenecks.
   - **Min Latency**: Explain what minimum latency measures (baseline network and server processing overhead under optimal zero-contention conditions) and what ${job.result?.minResponseTime ? job.result.minResponseTime.toFixed(2) + ' ms' : 'N/A'} indicates.
   - **Requests Per Second (RPS) & Throughput**: Explain what RPS represents conceptually, and what ${job.result?.requestsPerSecond ? job.result.requestsPerSecond.toFixed(2) : 'N/A'} RPS (across ${job.result?.totalRequests || 0} total requests) means regarding server request processing capacity.
   - **Success Rate & Failure Rate**: Explain what failure rate measures conceptually, and what ${failureRatePct}% failure rate (${job.result?.failedRequests || 0} failed requests) indicates regarding endpoint reliability and HTTP status health.
   - **Passed vs Failed Checks**: Explain what metric checks represent conceptually, and what ${job.result?.checksPassed || 0} passed vs ${job.result?.checksFailed || 0} failed checks signify.

3. 🔍 **Bottleneck & Root Cause Diagnosis**
   - Identify potential root causes for any observed tail latency or performance bottlenecks (e.g., event loop blocking in Node.js, missing database query indexes, connection pool exhaustion, un-cached expensive computations, cold starts, memory leaks, or local network constraints).

4. 💡 **How to Make This API Perform Better & Keep It Under Control**
   - Explain clear, practical technical solutions to optimize the backend, database, caching, connection pooling, and infrastructure.
   - Explain how to keep response times under control as traffic scales up.
   - (REMINDER: Explain all fixes in plain text and bullet points. DO NOT output any code blocks, k6 scripts, or command line code).

5. 🚀 **Recommended Next Benchmark Plan**
   - Explicitly recommend scaling from the current load of ${currentVUs} VUs up to ${suggestedNextVUs} VUs for the next load test run.
   - Explain what specific performance indicators (such as P95 latency thresholds and failure rates) to monitor during that next test to keep the API operating smoothly.
`.trim();

  const messages = [
    {
      role: "system",
      content: "You are an expert Performance Engineer and Systems Architect analyzing stress test telemetry data. You provide deep, structured, precise technical reports. ABSOLUTE RULE: NEVER output any programming code, k6 scripts, JSON snippets, or bash/CLI commands. All output MUST be written purely in clear, analytical text.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  return await callOpenRouter(messages, 0.3);
};

/**
 * Handles interactive follow-up questions from the user regarding a test run.
 * @param {Object} job - The MongoDB TestJob document
 * @param {string} userQuestion - The user's question
 * @param {Array} chatHistory - Previous messages [{ role: 'user'|'assistant', content: string }]
 * @returns {Promise<string>} AI response answer
 */
const askAIChat = async (job, userQuestion, chatHistory = []) => {
  const isCompleted = job.status === "completed" && job.result;

  const systemContext = `
You are K6 Lab's AI Performance Assistant contextually bound to the following stress test job data:
- Test Name: ${job.name}
- Target: ${job.config?.method} ${job.config?.url}
- Simulation: ${job.config?.vus} VUs for ${job.config?.duration}
- Status: ${job.status}
${isCompleted ? `- Avg Latency: ${job.result.avgResponseTime?.toFixed(1)}ms, P95: ${job.result.p95ResponseTime?.toFixed(1)}ms, Max: ${job.result.maxResponseTime?.toFixed(1)}ms
- Total Requests: ${job.result.totalRequests}, Failure Rate: ${(job.result.failedRequestRate * 100).toFixed(1)}%` : `- Failure Error: ${job.error}`}

Answer the user's questions clearly, accurately, and thoroughly.
STRICT RULE: Do NOT generate or return any k6 scripts, code blocks, or programming snippets unless the user explicitly asks for code. Focus on clear architectural, database, system tuning, and performance engineering explanations formatted in clean GitHub Markdown text.
`.trim();

  const messages = [
    { role: "system", content: systemContext },
    ...chatHistory.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
    { role: "user", content: userQuestion },
  ];

  return await callOpenRouter(messages, 0.5);
};

module.exports = {
  generateTelemetryAudit,
  askAIChat,
};
