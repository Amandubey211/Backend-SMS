// services/apiService.js
import axios from 'axios';
import { baseUrl } from '../config/Common';

// Create an instance of axios with default configurations
const apiService = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (optional)
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken"); // Retrieve token from localStorage
    // console.log("Token Retrieved:", token); // Debugging the token

    if (token) {
      config.headers['Authentication'] = `Bearer ${token}`; // Attach token to request headers with the correct header name
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
