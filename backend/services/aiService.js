const axios = require("axios");

/**
 * Generates telemetry audit suggestions for a stress test run using OpenRouter AI.
 * @param {Object} job - The MongoDB TestJob document
 * @returns {Promise<string>} The AI performance suggestions
 */
const generateTelemetryAudit = async (job) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API Key not configured in server environment (.env).");
  }

  const latencyMsg = job.status === "completed" && job.result
    ? `Average Latency: ${job.result.avgResponseTime.toFixed(1)}ms, Max Latency: ${job.result.maxResponseTime.toFixed(1)}ms, P95: ${job.result.p95ResponseTime.toFixed(1)}ms.`
    : "No latency metrics (test failed).";

  const requestsMsg = job.status === "completed" && job.result
    ? `Total requests fired: ${job.result.totalRequests}, failed rate: ${(job.result.failedRequestRate * 100).toFixed(1)}%, checks passed: ${job.result.checksPassed}, checks failed: ${job.result.checksFailed}.`
    : `Test failed with error: "${job.error}".`;

  const prompt = `
You are K6 Lab's Performance AI Assistant. Analyze this local k6 stress test run:
- Test Name: ${job.name}
- Target URL: ${job.config.method} ${job.config.url}
- Simulation Spec: ${job.config.vus} VUs for ${job.config.duration}
- Latency Report: ${latencyMsg}
- Request Logs Report: ${requestsMsg}

Your task is to provide a highly personalized, context-specific performance review in friendly, simple plain English for the developer.

STRICT CONSTRAINTS & REQUIREMENTS:
1. Talk ONLY about the metrics of this specific target URL endpoint run. Keep the review positive and direct.
2. If the failure rate is 0% and the latency is fast (which is true for most successful runs), congratulate the developer enthusiastically! Tell them exactly: "Your local server handled ${job.config.vus} VUs beautifully with absolutely zero errors and super fast response times! You've built a very solid, good-looking endpoint."
3. Next, recommend increasing the simulation scale/stress to see where the actual performance boundaries are. Advise them: "Now, let's see what happens under actual high stress. Try increasing your VUs to 20 or 50, and duration to 30s or 1m, to see where the performance boundaries really lie."
4. If there were failures, explain the specific network/local error in simple, conversational terms.
5. Provide exactly 2 or 3 extremely brief, friendly, highly contextual bullet points.
6. AVOID all standard textbooks suggestions. Under no circumstances should you generate or output any phrases or bullet points resembling:
   - "Profile the endpoint's dependencies" or "Profile dependencies"
   - "Add error/failure scenarios"
   - "Check database queries" or "database bottlenecks"
   - "Invalid payloads" or "edge cases"
   - "Slow operations even at low load"
   Do not mention database queries, external integrations, profiling tools, or payload tests. Keep the review exclusively focused on congratulating their clean run and encouraging them to scale up VUs/duration to test actual boundary limits.

Keep the entire response extremely concise, highly focused, and formatted in clean Markdown.
`.trim();

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "nvidia/nemotron-nano-9b-v2:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    }
  );

  return response.data?.choices?.[0]?.message?.content || "No analysis generated. Please try again.";
};

module.exports = {
  generateTelemetryAudit,
};
