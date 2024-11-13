// services/apiService.js
import axios from 'axios';

// Create an instance of axios with default configurations
const apiService = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (optional)
apiService.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional)
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default apiService;
