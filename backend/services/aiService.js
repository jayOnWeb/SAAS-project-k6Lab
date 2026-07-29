const axios = require("axios");

// Fallback pool of known top free OpenRouter models
const STATIC_FREE_MODELS = [
  "openrouter/free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "inclusionai/ling-3.0-flash:free"
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
            "HTTP-Referer": "http://localhost:8000",
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
            "HTTP-Referer": "http://localhost:8000",
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

  const prompt = `
You are K6 Lab's Lead Senior Performance & Reliability AI Engineer.
Analyze the following k6 stress test run results for the user and provide a detailed, data-driven performance answer.

### TEST CONFIGURATION:
- Test Name: ${job.name || "Load Test"}
- Target Endpoint: ${job.config?.method || "GET"} ${job.config?.url || "Target URL"}
- Virtual Users (VUs): ${job.config?.vus || 1} VUs
- Target Duration: ${job.config?.duration || "10s"}
- Final Execution Status: ${job.status}

### METRICS & TELEMETRY DATA:
${telemetrySummary}

### EXECUTION LOG SNIPPET:
\`\`\`
${recentLogs}
\`\`\`

### YOUR TASK:
Provide a highly thorough, professional, data-based analysis of this test run.
Follow this EXACT format with clean GitHub Markdown headings and emojis:

1. 🎯 **Health Score & Executive Verdict**
   - Give an overall Health Score out of 100 (e.g. **95/100 - EXCELLENT**, **65/100 - NEEDS OPTIMIZATION**, **20/100 - CRITICAL BOTTLENECK**).
   - Provide a clear 2-3 sentence executive summary of how the endpoint performed under ${job.config?.vus || 1} VUs.

2. 📊 **Latency & Throughput Deep Dive**
   - Analyze the average latency vs P95 and Max latency spikes. Discuss jitter and tail latency.
   - Evaluate the Requests Per Second (RPS) throughput and success vs failure breakdown.

3. 🔍 **Bottleneck & Root Cause Diagnosis**
   - Identify potential bottlenecks (e.g., event loop blocking, unindexed database queries, HTTP connection limits, cold starts, memory leaks, or local network constraints).
   - If there were errors/failures, explain the root cause clearly based on the logs and metrics.

4. 💡 **Actionable Technical Recommendations & Fixes**
   - Provide 2-3 concrete, actionable technical recommendations. Include example code, DB index commands, or architectural adjustments where applicable.

5. 🚀 **Recommended Next Benchmark Plan**
   - Suggest exact parameters (VUs, Duration) for the next load test to push the endpoint to its breaking limit safely.

Make sure your answer is very detailed, well-structured, easy to read, and grounded strictly in the provided data.
`.trim();

  const messages = [
    {
      role: "system",
      content: "You are an expert Performance Engineer and Systems Architect analyzing k6 stress test metrics. You provide deep, structured, precise technical reports based on empirical load testing data.",
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

Answer the user's questions clearly, accurately, and thoroughly with helpful code snippets, k6 scripts, or performance advice. Keep the answers formatted in beautiful GitHub Markdown.
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
