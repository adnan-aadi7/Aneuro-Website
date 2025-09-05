// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000/api",
  baseURL: "http://api.aneuro.io/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// NEW: 401 handler
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // clean local auth
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // hard redirect (avoids circular imports)
      window.location.replace("/login");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
