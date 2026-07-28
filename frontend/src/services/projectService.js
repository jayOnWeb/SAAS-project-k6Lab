import api from "./api";

export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post("/projects", data);
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

export const createFolder = async (data) => {
  const res = await api.post("/projects/folders", data);
  return res.data;
};

export const getFoldersByProject = async (projectId) => {
  const res = await api.get(`/projects/${projectId}/folders`);
  return res.data;
};

export const deleteFolder = async (id) => {
  const res = await api.delete(`/projects/folders/${id}`);
  return res.data;
};
