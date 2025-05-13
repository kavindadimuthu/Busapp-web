import axios from 'axios';
import type { Stop, BusSchedule } from './type';

// API base URL - this should be from your environment variables in a real app
const API_BASE_URL = 'http://localhost:5000'; // adjust as needed

// Get all stops
export const getStops = async (): Promise<Stop[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stops`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stops:', error);
    throw error;
  }
};

// Search schedules with pagination and sorting
export const searchSchedules = async (params: any): Promise<{
  schedules: BusSchedule[];
  total: number;
  limit: number;
  offset: number;
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedule`, { params });
    
    // Return full pagination data from the backend
    return {
      schedules: response.data.schedules || [],
      total: response.data.total || 0,
      limit: response.data.limit || 10,
      offset: response.data.offset || 0
    };
  } catch (error) {
    console.error('Error searching schedules:', error);
    throw error;
  }
};