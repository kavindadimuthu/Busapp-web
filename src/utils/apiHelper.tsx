import axios from 'axios';
import type { Stop, Journey, JourneyResponse, JourneySearchParams, OperatorTypesResponse } from './type';
import { backendUrl } from './config'; // Adjust the import based on your project structure

// API base URL - this should be from your environment variables in a real app
const API_BASE_URL = backendUrl; // adjust as needed

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

// Search journeys with pagination and sorting
export const searchJourneys = async (params: JourneySearchParams): Promise<JourneyResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/journey`, { params });
    console.log('API response:', response.data);

    // Return full pagination data from the backend
    return {
      journeys: response.data.journeys || [],
      total: response.data.total || 0,
      limit: response.data.limit || 10,
      offset: response.data.offset || 0
    };
  } catch (error) {
    console.error('Error searching journeys:', error);
    throw error;
  }
};

// Get a single journey by ID
export const getJourneyById = async (journeyId: string): Promise<Journey> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/journey/${journeyId}`);
    console.log('Journey data:', response.data);
    // console.log('Journey fetched successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching journey:', error);
    throw error;
  }
};

// Get operator types
export const getOperatorTypes = async (): Promise<string[]> => {
  try {
    console.log('Fetching operator types in api helper...');
    const response = await axios.get<OperatorTypesResponse>(`${API_BASE_URL}/operators/types`);
    console.log('Operator types:', response.data);
    return response.data.types || [];
  } catch (error) {
    console.error('Error fetching operator types:', error);
    throw error;
  }
};

// Get bus types
export const getBusTypes = async (): Promise<string[]> => {
  try {
    console.log('Fetching bus types...');
    const response = await axios.get<{types: string[]}>(`${API_BASE_URL}/buses/types`);
    console.log('Bus types:', response.data);
    return response.data.types || [];
  } catch (error) {
    console.error('Error fetching bus types:', error);
    throw error;
  }
};