const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, body) { super(message); this.name = "ApiError"; this.status = status; this.body = body; }
}

function failureCategory(status) {
  if (status === 401) return "session";
  if (status === 403) return "authorization-or-cors";
  if (status >= 500) return "server";
  return "request";
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: { Accept: "application/json", ...options.headers },
    });
  } catch {
    if (import.meta.env.DEV) console.warn("[api] request failed", { path, status: 0, category: "network" });
    throw new ApiError("Network request failed.", 0);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (import.meta.env.DEV) console.warn("[api] request failed", { path, status: response.status, category: failureCategory(response.status) });
    throw new ApiError("API request failed.", response.status, body);
  }
  return body;
}
const json = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const getServices = () => request("/api/services");
export const getMaterials = () => request("/api/materials");
export const submitQuote = (payload) => request("/api/quotes", json("POST", payload));
export const getCurrentAdmin = () => request("/api/auth/me");
export const loginAdmin = (credentials) => request("/api/auth/login", json("POST", credentials));
export const logoutAdmin = () => request("/api/auth/logout", { method: "POST" });
export const getAdminQuotes = () => request("/api/admin/quotes");
export const getAdminQuote = (quoteId) => request(`/api/admin/quotes/${quoteId}`);
export const updateAdminQuoteStatus = (quoteId, status) => request(`/api/admin/quotes/${quoteId}/status`, json("PATCH", { status }));
export const deleteAdminQuote = (quoteId) => request(`/api/admin/quotes/${quoteId}`, { method: "DELETE" });

export const getPublicProjects = () => request("/api/projects");
export const getPublicProject = (projectId) => request(`/api/projects/${projectId}`);
export const getAdminProjects = () => request("/api/admin/projects");
export const getAdminProject = (projectId) => request(`/api/admin/projects/${projectId}`);
export const createAdminProject = (payload) => request("/api/admin/projects", json("POST", payload));
export const updateAdminProject = (projectId, payload) => request(`/api/admin/projects/${projectId}`, json("PATCH", payload));
export const setAdminProjectPublished = (projectId, published) => request(`/api/admin/projects/${projectId}/publish`, json("PATCH", { published }));
export const deleteAdminProject = (projectId) => request(`/api/admin/projects/${projectId}`, { method: "DELETE" });

export const uploadAdminProjectImages = (projectId, formData) => request(`/api/admin/projects/${projectId}/images`, { method: "POST", body: formData });
export const deleteAdminProjectImage = (projectId, imageId) => request(`/api/admin/projects/${projectId}/images/${imageId}`, { method: "DELETE" });
