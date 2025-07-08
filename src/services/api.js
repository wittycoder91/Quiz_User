import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;

// API endpoints
export const API_ENDPOINTS = {
  GETLOGO: `${API_BASE_URL}/settings/admin/get-logo`,
  GETSETTINGS: `${API_BASE_URL}/settings/admin/get-settings`,
  GETACTIVEQUIZ: `${API_BASE_URL}/auth/quiz/get-last-active`,
};

// Helper function to extract data from API response
const extractDataFromResponse = (response) => {
  // Check if response has success/data structure
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  // Check if response has data property
  if (response.data.data) {
    return response.data.data;
  }
  // Return the response data directly
  return response.data;
};

// API service functions
export const apiService = {
  // Get logo
  getLogo: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GETLOGO);
      return extractDataFromResponse(response);
    } catch (error) {
      console.error('Error fetching logo:', error);
      throw error;
    }
  },

  // Get settings
  getSettings: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GETSETTINGS);
      return extractDataFromResponse(response);
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Get active quiz
  getActiveQuiz: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GETACTIVEQUIZ);
      
      // Handle the new response structure
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to get quiz data');
      }
    } catch (error) {
      console.error('Error fetching active quiz:', error);
      throw error;
    }
  },
};

export { UPLOAD_URL }; 