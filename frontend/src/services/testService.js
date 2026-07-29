import api from "./api";

// Run Test
export const runTest = async (data) => {
  const response = await api.post("/run-test", data);
  return response.data;
};

// Get All Results
export const getAllTests = async () => {
  const response = await api.get("/test/results");
  return response.data;
};

// Get Single Test
export const getTestById = async (id) => {
  const response = await api.get(`/test/${id}`);
  return response.data;
};

// Delete Test
export const deleteTest = async (id) => {
  const response = await api.delete(`/test/${id}`);
  return response.data;
};

// Cancel Running Test
export const cancelTest = async (id) => {
  const response = await api.post(`/test/${id}/cancel`);
  return response.data;
};

// Get Local Agent Status
export const getAgentStatus = async () => {
  const response = await api.get("/agents/me");
  return response.data;
};

// Register New Local Agent
export const registerAgent = async (name) => {
  const response = await api.post("/agents/register", { name });
  return response.data;
};

// Get AI Suggestions Analysis
export const getAISuggestions = async (id, force = false) => {
  const response = await api.get(`/test/${id}/ai-suggestions${force ? "?force=true" : ""}`);
  return response.data;
};

// Ask AI Chat follow-up question
export const askAIChat = async (id, question, chatHistory = []) => {
  const response = await api.post(`/test/${id}/ai-chat`, { question, chatHistory });
  return response.data;
};