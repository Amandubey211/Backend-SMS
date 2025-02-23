// services/apiService.js
import axios from 'axios';
import { baseUrl } from '../config/Common';
import Cookies from 'js-cookie';


// Create an instance of axios with default configurations
const apiService = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
  timeout: 15000, // Timeout after 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (optional)
apiService.interceptors.request.use(
  (config) => {
    config.withCredentials = true
       // 🔹 Check if the request contains file upload
       if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data"; // Set correct header
        config.timeout = 60000; // Increase timeout to 120 sec (for file upload)
      } else {
        config.headers["Content-Type"] = "application/json"; // Default JSON request
        config.timeout = 15000; // Keep standard request timeout at 15 sec
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Add a response interceptor (optional)
// apiService.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally
//     console.error('API error:', error);
//     return Promise.reject(error);
//   }
// );

export default apiService;
