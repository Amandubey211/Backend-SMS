// services/apiEndpoints.js
import apiService from "./apiService";

// GET request
export const getData = async (endpoint, params = {}) => {
  try {
    const response = await apiService.get(endpoint, { params });

    return response?.data;
  } catch (error) {
    // console.log("Error fetching data:", error);
  }
};

// POST request
export const postData = async (endpoint, data) => {
  try {
    const response = await apiService.post(endpoint, data);
    return response?.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.log(error.response.data, "sdf");

      return error.response.data;
    }

    // console.log("Error posting data:", error);
  }
};

// PUT request
export const putData = async (endpoint, data) => {
  try {
    const response = await apiService.put(endpoint, data);
    return response?.data;
  } catch (error) {
    return error;
  }
};

// DELETE request
export const deleteData = async (endpoint) => {
  try {
    const response = await apiService.delete(endpoint);
    return response?.data;
  } catch (error) {
    return error;
  }
};

// PATCH request (optional)
export const patchData = async (endpoint, data) => {
  try {
    const response = await apiService.patch(endpoint, data);
    return response?.data;
  } catch (error) {
    return error;
  }
};

// Example for custom API requests if needed

export const customRequest = async (
  method,
  endpoint,
  data = null,
  headers,
  config = {}
) => {
  try {
    const response = await apiService({
      method,
      url: endpoint,
      data,
      headers,
      ...config, // Spread additional configurations like params and headers
    });
    return response?.data;
  } catch (error) {
    // console.log("Error with custom request:", error);
    throw error; // Re-throw the error for the thunk to handle
  }
};
