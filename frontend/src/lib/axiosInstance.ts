import axios from 'axios';
import Cookies from 'js-cookie';

// Function to retrieve token from cookies
const getAuthToken = (): string | undefined => {
  return Cookies.get("auth_token"); // Retrieve token from cookies
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Ensure this URL is correct
  withCredentials: true, // This ensures cookies are sent with the request
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to attach the token to each request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken(); // Use getter to retrieve the token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to request header
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log("No token found"); // Log only in development mode
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;