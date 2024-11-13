// services/apiEndpoints.js
import apiService from "./apiService";


// GET request
export const getData = async (endpoint, params = {}) => {
  try {
    const response = await apiService.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// POST request
export const postData = async (endpoint, data) => {
  try {
    const response = await apiService.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// PUT request
export const putData = async (endpoint, data) => {
  try {
    const response = await apiService.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

// DELETE request
export const deleteData = async (endpoint) => {
  try {
    const response = await apiService.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

// PATCH request (optional)
export const patchData = async (endpoint, data) => {
  try {
    const response = await apiService.patch(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error patching data:', error);
    throw error;
  }
};

// Example for custom API requests if needed
export const customRequest = async (method, endpoint, data = null) => {
  try {
    const response = await apiService({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Error with custom request:', error);
    throw error;
  }
};
