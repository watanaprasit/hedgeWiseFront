import axios from 'axios';

// Configure Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Base URL for your Django API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch FX rates from the backend API
export const fetchFXRates = async () => {
  try {
    const response = await api.get('/currency-data/'); // Adjusted API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching FX rates:', error);
    throw error;
  }
};




