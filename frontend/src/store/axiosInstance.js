import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Change this to your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  // You can add more default config here (e.g., withCredentials, timeout, etc.)
});

// Attach JWT token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance; 