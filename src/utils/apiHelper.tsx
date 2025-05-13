import axios from 'axios';
import type { BusSchedule, SchedulesResponse, Stop } from './type';

const API_BASE_URL = 'http://localhost:5000';

// Types based on the backend response format


// Get all stops
export const getStops = async (): Promise<Stop[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stops`);
    return response.data.stops;
  } catch (error) {
    console.error('Error fetching stops:', error);
    return [];
  }
};

// Search for schedules with various parameters
export const searchSchedules = async (params: {
  source?: string;
  destination?: string;
  date?: string;
  operator?: string;
  bus_type?: string;
  route_name?: string;
}): Promise<BusSchedule[]> => {
  try {
    const response = await axios.get<SchedulesResponse>(`${API_BASE_URL}/schedule`, {
      params: {
        ...params,
        limit: 50,
        offset: 0,
      },
    });
    return response.data.schedules || [];
  } catch (error) {
    console.error('Error searching schedules:', error);
    return [];
  }
};