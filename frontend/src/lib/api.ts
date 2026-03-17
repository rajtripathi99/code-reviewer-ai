import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Don't intercept auth endpoints — avoids infinite loops
    const isAuthEndpoint =
      original.url?.includes("/api/auth/me") ||
      original.url?.includes("/api/auth/login") ||
      original.url?.includes("/api/auth/refresh");

    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api(original);
      } catch {
        // Refresh failed — let the component handle the 401, don't force redirect
      }
    }

    return Promise.reject(err);
  }
);

export default api;