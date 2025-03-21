import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_CONFIG = {
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
};
// In your config/config.js where axiosInstance is created
export const axiosInstance = axios.create({
    baseURL: "https://sand-backend-kwqd.onrender.com",
    withCredentials: true, // 👈 Add this to send cookies
    timeout: 10000
  });
