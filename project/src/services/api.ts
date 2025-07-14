// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export default api;
export const fetchData = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};