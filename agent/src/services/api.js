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

export async function notifyLogout() {
  try {
    const api = await createClient();
    await api.post("/api/agent/logout");
  } catch (err) {
    // Ignore network error during logout notification
  }
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
