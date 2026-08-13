const axios = require("axios");

// Fallback pool of known top free OpenRouter models (Ordered by fastest response)
const STATIC_FREE_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "liquid/lfm-2.5-2.6b:free",
  "poolside/laguna-s-2.1:free"
];

/**
 * Dynamically fetches all currently active free model IDs directly from OpenRouter API
 */
const fetchDynamicFreeModels = async () => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", { timeout: 5000 });
    const models = response.data?.data || [];
    const freeIds = models
      .filter((m) => m.id && (m.id.endsWith(":free") || m.pricing?.prompt === "0"))
      .map((m) => m.id);
    return freeIds;
  } catch (err) {
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

  // 1. Try static list first (fast timeout 10s per model)
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
          timeout: 10000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return content;
      }
    } catch (err) {
      lastError = err;
    }
  }

  // 2. If static list failed, dynamically query OpenRouter API for active free models
  const dynamicModels = await fetchDynamicFreeModels();

  for (const model of dynamicModels.slice(0, 5)) {
    if (STATIC_FREE_MODELS.includes(model)) continue;

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
          timeout: 8000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return content;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    `OpenRouter free model error: ${lastError?.response?.data?.error?.message || lastError?.message || "All free models busy. Please retry."}`
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

/**
 * Instant heuristic telemetry audit generator (ensures zero downtime if LLM API is busy)
 */
const generateHeuristicAudit = (job) => {
  const isCompleted = job.status === "completed" && job.result;
  const avg = job.result?.avgResponseTime || 0;
  const p95 = job.result?.p95ResponseTime || 0;
  const rps = job.result?.requestsPerSecond || 0;
  const failed = job.result?.failedRequests || 0;
  const failRate = (job.result?.failedRequestRate || 0) * 100;
  
  let score = 92;
  if (avg > 500) score -= 20;
  if (p95 > 1000) score -= 25;
  if (failRate > 1) score -= 30;
  score = Math.max(15, Math.min(99, Math.round(score)));

  return `
### 🎯 **Health Score & Executive Verdict: ${score}/100**
The API test completed under **${job.config?.vus || 1} Virtual Users**. The average latency observed was **${avg.toFixed(1)} ms** with a 95th percentile (P95) response time of **${p95.toFixed(1)} ms**. Overall throughput reached **${rps.toFixed(1)} Requests/sec** with a failure rate of **${failRate.toFixed(2)}%**.

---

### 📖 **Dashboard Metrics Deep Dive**
- **Average Latency (${avg.toFixed(1)} ms)**: Baseline response time across all concurrent requests.
- **P95 Latency (${p95.toFixed(1)} ms)**: The threshold below which 95% of user requests finished. Critical for detecting tail latency.
- **Throughput (${rps.toFixed(1)} RPS)**: Server request processing capacity across ${job.result?.totalRequests || 0} total requests.
- **Failure Rate (${failRate.toFixed(2)}%)**: ${failed} failed requests observed out of total executions.

---

### 🔍 **Bottleneck & Root Cause Diagnosis**
${failRate > 0 ? "- **Concurrency Bottleneck**: Non-2xx HTTP responses detected under load. Check database connection pool limits and server timeout settings." : "- **Stable Execution**: Zero dropped requests or HTTP errors recorded during the simulation."}
- **Database & Query Indexing**: Verify that endpoints querying MongoDB/SQL have proper indexing on filtered fields.

---

### 💡 **Performance Optimization Solutions**
1. **Response Caching**: Implement in-memory caching (Redis / Memory Cache) for repeated GET requests.
2. **Connection Pooling**: Keep persistent database connection pools open to eliminate connection handshake overhead.
3. **Payload Compression**: Ensure Gzip/Brotli compression is active for API responses exceeding 1KB.

---

### 🚀 **Recommended Next Benchmark Plan**
Scale your next test run to **${(job.config?.vus || 1) <= 10 ? 50 : (job.config?.vus || 1) * 2} Virtual Users** to measure saturation limits and verify P95 resilience.
`.trim();
};

  try {
    return await callOpenRouter(messages, 0.3);
  } catch (err) {
    console.warn("OpenRouter API busy, falling back to heuristic audit:", err.message);
    return generateHeuristicAudit(job);
  }
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

  try {
    return await callOpenRouter(messages, 0.5);
  } catch (err) {
    console.warn("OpenRouter Chat busy, falling back to default answer:", err.message);
    return `Based on this test run (${job.config?.vus || 1} VUs on \`${job.config?.url || 'API'}\` with avg latency **${job.result?.avgResponseTime?.toFixed(1) || 0}ms** and P95 **${job.result?.p95ResponseTime?.toFixed(1) || 0}ms**): ${userQuestion.includes('optimize') ? 'To optimize, consider adding database indexing, memory caching, and increasing connection pool sizes.' : 'The performance metrics indicate healthy baseline behavior. Consider scaling virtual users to find the breaking point.'}`;
  }
};

module.exports = {
  generateTelemetryAudit,
  askAIChat,
};
