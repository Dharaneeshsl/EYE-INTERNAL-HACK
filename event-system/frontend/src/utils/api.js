import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for sending cookies
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 422:
          // Validation error
          console.error('Validation failed:', error.response.data.errors);
          break;
        default:
          console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;